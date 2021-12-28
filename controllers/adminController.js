const { UserDB } = require('../models');
const userController = require('./userController');
require('dotenv').config()

const key = process.env.ADMIN_KEY;

exports.access = async (req, res) => {
    var session = req.app.sessions;
    const user = await userController.getUserByID(session.userid)
    if (user) {
        if (user.isAdmin) {
            res.render('admin/dashboard')
        } else {
            console.log("User is not admin!");
            res.redirect('/')
        }
    } else {
        res.redirect('/admin')
    }

}
exports.login = async (req, res) => {
    const user = await UserDB.findOne({ where: { isAdmin: true, email: req.body.email.toLowerCase(), password: req.body.password } });
    if (user !== null) {
        var session = req.app.sessions;
        session.userid = user.ID;
        if (req.body.key === key) {
            res.redirect('admin/dashboard')
        }
    }
}