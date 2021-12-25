const db = require('../models');
const serverDB = db.ServerDB;
const fs = require('fs');


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
    //TODO: Delete server file
    var session = req.app.sessions;
    var server = await serverDB.findOne({ where: { ID: req.params.serverid, owner: session.userid } });
    fs.unlinkSync(`./models/serverbanners/${server.banner}`);
    await server.destroy({ where: { ID: req.params.serverid, owner: session.userid } })
    res.redirect(`/user/servers/${session.userid}`)
}