const db = require('../models');
const serverDB = db.ServerDB;
const bucketController = require('./bucketController');
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

exports.addServerPOST = async (req, res) => {
    const date = new Date();
    const day = date.getDate();
    var month = date.getMonth();
    const year = date.getFullYear();
    var session = req.app.sessions;
    const server = await serverDB.findOne({ where: { ip: req.body.serverip, port: req.body.serverport } })
    const file = req.file;
    const result = await bucketController.uploadFile(file);
    const tags = (req.body.tags).toString();
    await unlinkFile(file.path)
    if (server !== null) {
        res.redirect('add?alert=serveralreadyadded');
    } else {
        await serverDB.create({
            owner: session.userid,
            version: req.body.version,
            servername: req.body.servername,
            ip: req.body.serverip,
            port: req.body.serverport,
            website: req.body.websiteurl,
            discord: req.body.discordurl,
            tags: tags,
            banner: result.Key,
            description: req.body.serverdesc,
            timeAdded: day + "/" + ++month + "/" + year,
            lastBump: date.getHours() + "/" + day + "/" + month
        });

        res.redirect(`/user/servers/${session.userid}`);
    }
}
exports.addServerGET = (req, res) => {
    var session = req.app.sessions;
    let alert = req.query.alert;
    session.userid ? res.render('editserver', { loggedIn: session.userid, alert: alert }) : res.render('user/login', { alert: "notlogged" });
}
exports.findServersByUser = async (userid) => {
    return await serverDB.findAll({ where: { owner: userid } });;
}
exports.deleteServer = async (req, res) => {
    var session = req.app.sessions;
    if (!session.userid) res.redirect("/")
    else {
        var server = await serverDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } });
        if (!server) res.redirect("/")
        else {
            await bucketController.deleteFile(server.banner);
            await server.destroy({ where: { ID: req.params.serverid, owner: session.userid } })
            res.redirect(`/user/servers/${session.userid}`)
        }

    }
}
exports.editServerGet = async (req, res) => {
    var session = req.app.sessions;
    if (!session.userid) res.redirect("/")
    else {
        const server = await serverDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } })
        !server ? res.redirect("/") : res.render('editserver', { server: server, loggedIn: session.userid });
    }
}
exports.editServer = async (req, res) => {
    //TODO: Get banner and display it. If different, replace.
    var session = req.app.sessions;
    const server = await serverDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } });
    await server.update({
        servername: req.body.servername,
        ip: req.body.serverip,
        port: req.body.serverport,
        website: req.body.websiteurl,
        discord: req.body.discordurl,
        tags: req.body.tags,
        description: req.body.serverdesc
    })
    res.redirect(`/user/servers/${session.userid}`);
}
