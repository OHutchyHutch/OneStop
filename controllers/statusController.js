const { ServerDB } = require('../models');
const util = require('minecraft-server-util');

const options = {
    timeout: 1000 * 5, // timeout in milliseconds
    enableSRV: true // SRV record lookup
};

async function updateStatus() {
    const servers = await ServerDB.findAll();
    await Promise.all(servers.map(async (server) => {
        if (server.port) {
            try {
                const result = await util.status(server.ip, server.port, options);
                const playersonline = formatInteger(result.players.online);
                await server.update({
                    playercount: `${playersonline}`,
                    status: true,
                })
            } catch (e) {
                await server.update({
                    status: false,
                })
            }
        } else {
            try {
                const result = await util.status(server.ip);
                const playersonline = formatInteger(result.players.online);
                await server.update({
                    playercount: `${playersonline}`,
                    status: true,
                })
            } catch (e) {
                await server.update({
                    status: false,
                })
            }
        }
    }));
}
function formatInteger(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
exports.serverVoteGet = async (req, res) => {
    var session = req.session;
    const server = await ServerDB.findOne({ where: { ID: req.params.serverid } })
    if (server.token != '') {
        res.render('server/vote', { loggedIn: req.session.userid, server: server });
    } else {
        res.render('server/profile', { server: server, loggedIn: req.session.userid })
    }

}
exports.serverVotePost = async (req, res) => {
    var session = req.session;
    const server = await ServerDB.findOne({ where: { ID: req.params.serverid } })
    util.sendVote(server.ip, parseInt(server.tokenport), {
        token: server.token, // the token configured in the server plugin
        username: req.body.username,
        serviceName: 'OneStopServers.com',
        uuid: '', // player UUID, recommended but optional
        timestamp: Date.now(), // current time
        timeout: 1000 * 5 // timeout in milliseconds
    })
        .catch((error) => console.error(error));
    await server.update({
        votes: ++server.votes
    })
    res.render('server/profile', { server: server, loggedIn: req.session.userid, voted: true })
}

setInterval(updateStatus, 1000 * 10);