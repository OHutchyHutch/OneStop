const db = require('../models');
const serverDB = db.ServerDB;
const fs = require('fs');
if (!fs.existsSync('./models/serverbanners')) {
    fs.mkdir('./models/serverbanners');
}

exports.addServer = async (req, res) => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    var session = req.app.sessions;
    let server = await serverDB.findOne({ where: { ip: req.body.serverip, port: req.body.serverport } })
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
            tags: req.body.tags,
            //banner: `${req.protocol}://${req.hostname}/${req.file.destination}/${req.file.filename}`,
            banner: `${req.file.filename}`,
            description: req.body.serverdesc,
            timeAdded: day + "/" + ++month + "/" + year,
            lastBump: date.getHours() + "/" + day + "/" + month
        });

        res.redirect(`/user/servers/${session.userid}`);
    }
}
exports.findServersByUser = async (userid) => {
    const server = await serverDB.findAll({ where: { owner: userid } });
    return server;
}
exports.deleteServer = async (req, res) => {
    var session = req.app.sessions;
    if (!session.userid) {
        res.redirect("/")
    } else {
        var server = await serverDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } });
        if (!server) {
            res.redirect("/")
        } else {
            fs.unlink(`./models/serverbanners/${server.banner}`, (err) => {
                if (err) throw err;
            });
            await server.destroy({ where: { ID: req.params.serverid, owner: session.userid } })
            res.redirect(`/user/servers/${session.userid}`)
        }

    }
}
exports.editServerGet = async (req, res) => {
    var session = req.app.sessions;
    if (!session.userid) {
        res.redirect("/")
    } else {
        const server = await serverDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } })
        if (!server) {
            res.redirect("/")
        } else {
            res.render('editserver', { server: server, loggedIn: session.userid });
        }
    }
}
exports.editServer = async (req, res) => {
    //TODO: Get banner and display it. If different, replace.
    console.log("Editing server");
    var session = req.app.sessions;
    const server = await serverDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } });
    console.log(req.body);
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
