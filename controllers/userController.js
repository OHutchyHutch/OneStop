const db = require('../models');
const userDB = db.UserDB;
const serverController = require('../controllers/serverController');

exports.newUser = async (req, res) => {
    if (await userExists(req.body.email)) {
        res.redirect('createaccount?alert=emailalreadyinuse');
    }
    else {
        await userDB.create({ email: req.body.email.toLowerCase(), password: req.body.password });
        res.redirect('login?alert=accountcreated');
    }

};

exports.login = async (req, res) => {
    const user = await userDB.findOne({ where: { email: req.body.email.toLowerCase(), password: req.body.password } });
    if (user !== null) {
        var session = req.app.sessions;
        session.userid = user.ID;
        res.redirect('/');
    } else {
        res.redirect('login?alert=accountnotfound');
    }
}
async function userExists() {
    var user;
    if (arguments.length == 1) user = await userDB.findOne({ where: { email: arguments[0] } });
    else if (arguments.length == 2) user = await userDB.findOne({ where: { email: arguments[0], password: arguments[1] } });

    return !(user === null);
}

exports.getServersOwnedByUser = async (req, res) => {
    var session = await req.app.sessions;
    if (req.params.userid == session.userid) {
        const servers = await serverController.findServersByUser(session.userid)
        res.render('profile', { loggedIn: session.userid, servers: servers })
    }
    else res.render('404', { loggedIn: session.userid });
}

