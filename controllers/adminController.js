const { UserDB, ServerDB, MinecraftServerDB } = require('../models');
const userController = require('./userController');
const bcrypt = require('bcryptjs');
require('dotenv').config()

const key = process.env.ADMIN_KEY;

exports.access = async (req, res) => {
    if (await hasAccess(req.session.userid)) {
        res.render('admin/dashboard')
    } else {
        res.redirect('/admin')
    }

}
exports.login = async (req, res) => {
    const user = await UserDB.findOne({ where: { isAdmin: true, email: req.body.email.toLowerCase() } });
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (user !== null && isMatch) {
        req.session.userid = user.ID;
        if (req.body.key === key) res.redirect('admin/dashboard')
    } else res.redirect('/admin')
}
exports.database = async (req, res) => {
    if (await hasAccess(req.session.userid) == false) {
        res.redirect('/admin')
    }
    const database = req.query.database;
    switch (database) {
        case 'users':
            res.render('admin/database', { data: await UserDB.findAll(), type: 'user' })
            break;
        case 'servers':
            res.render('admin/database', { data: await ServerDB.findAll(), type: 'servers' })
            break;
        case 'versions':
            let data = await MinecraftServerDB.findOne();
            let versions = (data.versions).split(',')
            let tags = (data.tags).split(',')
            res.render('admin/database', { versions: versions, tags: tags, type: 'versions' })
            break;
    }
}
exports.saveTags = async (req, res) => {
    const data = await MinecraftServerDB.findOne();
    const versiontags = (((req.body.versionstags).sort()).reverse()).toString();
    const tags = ((req.body.tags).sort()).toString();
    await data.update({ versions: versiontags, tags: tags })
    res.redirect('/admin/dashboard/database?database=versions')
}

async function hasAccess(userID) {
    const user = await userController.getUserByID(userID)
    if (user) return user.isAdmin
    return false;
}
exports.getTagData = async () => {
    return await MinecraftServerDB.findOne();
}