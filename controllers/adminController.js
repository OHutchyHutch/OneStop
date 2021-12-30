const { UserDB } = require('../models');
const userController = require('./userController');
require('dotenv').config()

const key = process.env.ADMIN_KEY;

exports.access = async (req, res) => {
    var session = req.app.sessions;
    if (await hasAccess(session.userid)) {
        res.render('admin/dashboard')
    } else {
        res.redirect('/admin')
    }

}
exports.login = async (req, res) => {
    const user = await UserDB.findOne({ where: { isAdmin: true, email: req.body.email.toLowerCase(), password: req.body.password } });
    if (user !== null) {
        var session = req.app.sessions;
        session.userid = user.ID;
        if (req.body.key === key) res.redirect('admin/dashboard')
    }
}
exports.database = async (req, res) => {
    var session = req.app.sessions;
    if (await hasAccess(session.userid) == false) {
        res.redirect('/admin')
    }
    const database = req.query.database;
    switch (database) {
        case 'user':
            const data = await UserDB.findAll();
            res.render('admin/database', { data: data })
    }
}

async function hasAccess(userID) {
    const user = await userController.getUserByID(userID)
    if (user) return user.isAdmin
    return false;
}