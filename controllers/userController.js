const newUser = async (req, res) => {
    var user = await req.app.UserDB.findOne({where: {email: req.body.email}})
    if (user !== null){
        console.log(user);
        res.redirect('createaccount?alert=emailalreadyinuse');
    }
    else {
        user = await req.app.UserDB.create({email: req.body.email, password: req.body.password});
        res.redirect('login?alert=accountcreated');
    }
    
};
const validateUser = async (req, res) => {
    const user = await req.app.UserDB.findOne({where: {email: req.body.email, password: req.body.password}})
    if (user === null) {
        res.redirect('login?alert=accountnotfound');
    } else {
        var session = await req.app.sessions;
        session.userid = req.body.email;
        res.redirect('/');
    }
}
const logoutUser = async (req, res) => {
    var session = await req.app.sessions;
    session.userid = null;
    res.redirect('/');
}
module.exports = {newUser, validateUser, logoutUser};