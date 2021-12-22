exports.startSession = (req, res) => {
    var session = req.app.sessions;
    session.userid = req.query.sessionID;
};

exports.endSession = (req, res) => {
    var session = req.app.sessions;
    session.userid = null;
    res.redirect('/');
}