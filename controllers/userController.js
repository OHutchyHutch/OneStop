const db = require('../models');
const userDB = db.UserDB;
const serverController = require('../controllers/serverController');

exports.newUser = async (req, res) => {
    if (await userExists(req.body.email)) {
        res.redirect('/createaccount?alert=emailalreadyinuse');
    }
    else {
        var user = await userDB.create({ email: req.body.email.toLowerCase(), password: req.body.password });
        if (user.ID == 1) user.update({ isAdmin: true });
        res.redirect('/login?alert=accountcreated');
    }

};

exports.login = async (req, res) => {
    const user = await userDB.findOne({ where: { email: req.body.email.toLowerCase(), password: req.body.password } });
    if (user !== null) {
        var session = req.app.sessions;
        session.userid = user.ID;
        res.redirect('/');
    } else {
        res.redirect('/login?alert=accountnotfound');
    }
}
exports.getUserByID = async (id) => {
    if (id) {
        try { return await userDB.findOne({ where: { ID: id } }) }
        catch (err) { console.log(err); }
    }
}
async function userExists() {
    var user;
    if (arguments.length == 1) user = await userDB.findOne({ where: { email: arguments[0] } });
    else if (arguments.length == 2) user = await userDB.findOne({ where: { email: arguments[0], password: arguments[1] } });

    return !(user === null);
}

exports.getServersOwnedByUser = async (req, res) => {
    var session = req.app.sessions;
    if (session.userid) {
        const servers = await serverController.findServersByUser(session.userid)
        res.render('user/profile', { loggedIn: session.userid, servers: servers })
    }
    else res.render('user/login', { alert: "notlogged" });
}
exports.getUserSettings = async (req, res) => {
    var session = req.app.sessions;
    if (session.userid) {
        const user = await userDB.findOne({ where: { ID: session.userid } })
        res.render('user/accountsettings', { loggedIn: session.userid, user: user })
    } else {
        res.render('user/login', { alert: "notlogged" });
    }
}
