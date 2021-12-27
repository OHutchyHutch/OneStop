exports.endSession = (req, res) => {
    var session = req.app.sessions;
    session.userid = null;
    res.redirect('/');
}