const db = require('../models');
const userDB = db.UserDB;

exports.newUser = async (req, res) => {
    if (await userExists(req.body.email)){
        res.redirect('createaccount?alert=emailalreadyinuse');
    }
    else {
        await userDB.create({email: req.body.email, password: req.body.password});
        res.redirect('login?alert=accountcreated');
    }
    
};

exports.login = async (req, res) => {
    const user = await userDB.findOne({where: {email: req.body.email, password: req.body.password}});
    if (user !== null) {
        var session = req.app.sessions;
        session.userid = user.ID;
        res.redirect('/');
    } else {
        res.redirect('login?alert=accountnotfound');
    }
}

exports.getUserByID = async (id) => {
    console.log(`Searching for user with ID ${id}`)
    const user = await userDB.findOne({where: {ID: id}});
    return user;
}
async function userExists() {
    var user;
    if (arguments.length == 1) user = await userDB.findOne({where: {email: arguments[0]}});
    else if (arguments.length == 2) user = await userDB.findOne({where: {email: arguments[0], password: arguments[1]}});

    return !(user === null);
}

