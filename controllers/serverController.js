const { ServerDB, MinecraftServerDB } = require('../models');
const bucketController = require('./bucketController');

const fs = require('fs')
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)

exports.addServerPOST = async (req, res) => {
    const date = new Date();
    const day = date.getDate();
    var month = date.getMonth();
    const year = date.getFullYear();
    var session = req.session;
    var server;
    if (req.body.serverport) server = await ServerDB.findOne({ where: { ip: req.body.serverip, port: req.body.serverport } })
    else server = await ServerDB.findOne({ where: { ip: req.body.serverip } })
    if (server !== null) {
        res.redirect('add?alert=serveralreadyadded');
    } else {
        let result = null;
        if (req.file) {
            const file = req.file;
            result = await bucketController.uploadFile(file);
            await unlinkFile(file.path)
        }
        const tags = (req.body.tags).toString();
        var server;
        server = await ServerDB.create({
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
            token: req.body.token,
            tokenport: req.body.tokenport,
            timeAdded: day + "/" + ++month + "/" + year,
            lastBump: date.getHours() + "/" + day + "/" + month
        });
        res.redirect(`/servers/profile/${server.ID}`);
    }
}
exports.addServerGET = async (req, res) => {
    var session = req.session;
    let alert = req.query.alert;
    const data = await MinecraftServerDB.findOne();
    let versions = (data.versions).split(',')
    let tags = (data.tags).split(',')
    session.userid ? res.render('editserver', { loggedIn: session.userid, alert: alert, versions: versions, tags: tags }) : res.render('user/login', { alert: "notlogged" });
}
exports.findServersByUser = async (userid) => {
    return await ServerDB.findAll({ where: { owner: userid } });;
}
exports.deleteServer = async (req, res) => {
    var session = req.session;
    if (!session.userid) res.redirect("/")
    else {
        var server = await ServerDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } });
        if (!server) res.redirect("/")
        else {
            if (server.banner) {
                await bucketController.deleteFile(server.banner);
            }
            await server.destroy({ where: { ID: req.params.serverid, owner: session.userid } })
            res.redirect(`/user/profile`)
        }

    }
}
exports.editServerGet = async (req, res) => {
    var session = req.session;
    if (!session.userid) res.redirect("/")
    else {
        const data = await MinecraftServerDB.findOne();
        let dbversions = (data.versions).split(',')
        let dbtags = (data.tags).split(',')
        const server = await ServerDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } })
        let versions = (server.version).split(',')
        let tags = (server.tags).split(',')
        !server ? res.redirect("/") : res.render('editserver', { server: server, loggedIn: session.userid, versions: dbversions, tags: dbtags, serverversions: versions, servertags: tags });
    }
}
exports.editServer = async (req, res) => {
    //TODO: Get banner and display it. If different, replace.
    var session = req.session;
    const server = await ServerDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } });
    const tags = (req.body.tags).toString();
    if (req.file) {
        const file = req.file;
        const result = await bucketController.uploadFile(file);
        await server.update({
            servername: req.body.servername,
            ip: req.body.serverip,
            port: req.body.serverport,
            website: req.body.websiteurl,
            discord: req.body.discordurl,
            tags: tags,
            banner: result.Key,
            token: req.body.token,
            tokenport: req.body.tokenport,
            description: req.body.serverdesc
        })
    }
    else {
        await server.update({
            servername: req.body.servername,
            ip: req.body.serverip,
            port: req.body.serverport,
            website: req.body.websiteurl,
            discord: req.body.discordurl,
            tags: tags,
            token: req.body.token,
            tokenport: req.body.tokenport,
            description: req.body.serverdesc
        })
    }

    res.redirect(`/servers/profile/${server.ID}`);
}
exports.serverProfile = async (req, res) => {
    var session = req.session;
    session = session.userid;
    const server = await ServerDB.findOne({ where: { ID: req.params.serverid } })
    res.render('server/profile', { server: server, loggedIn: session })
}
exports.getAllServers = async (filter, param) => {
    switch (filter) {
        case 'version':
            return await ServerDB.findAll({ where: { version: param } })
        case 'sortedBy':
            switch (param) {
                case 'votes':
                    return await ServerDB.findAll({ order: [['votes', 'DESC']] })
                case 'players':
                    return await ServerDB.findAll({ order: [['playercount', 'DESC']] })
                case 'mostrecent':
                    return await ServerDB.findAll({ order: [['lastBump', 'DESC']] })
            }
        default:
            return await ServerDB.findAll({ order: [['votes', 'DESC']] })
    }
}
