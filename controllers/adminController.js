const { UserDB } = require('../models');
const userController = require('./userController');
require('dotenv').config()

const key = process.env.ADMIN_KEY;

exports.access = async (req, res) => {
    var session = req.app.sessions;
    const user = await userController.getUserByID(session.userid)
    if (user) {
        if (user.isAdmin) {
            console.log("User is admin!")
        } else {
            console.log("User is not admin!");
        }
    } else {

    }

}
exports.login = async (req, res) => {
    const user = await UserDB.findOne({ where: { isAdmin: true, email: req.body.email.toLowerCase(), password: req.body.password } });
    if (user !== null) {
        if (req.body.key === key) {
            console.log("Everything is correct, logging in!");
            res.redirect('adminpanel')
        }
    }
}