const { ServerDB } = require('../models');
const util = require('minecraft-server-util');

const options = {
    timeout: 1000 * 5, // timeout in milliseconds
    enableSRV: true // SRV record lookup
};

async function updateStatus() {
    const servers = await ServerDB.findAll();
    await Promise.all(servers.map(async (server) => {
        let data;
        if (server.port) {
            try {
                const result = await util.status(server.ip, server.port);
                const playersonline = formatInteger(result.players.online);
                const maxplayers = formatInteger(result.players.max);
                await server.update({
                    playercount: `${playersonline}/${maxplayers}`,
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
                const maxplayers = formatInteger(result.players.max);
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

exports.sendVote = async (req, res) => {

}

setInterval(updateStatus, 1000 * 10);