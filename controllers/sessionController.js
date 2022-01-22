exports.endSession = (req, res) => {
    req.session.isAuth = false;
    req.session.save(function (err) {
        res.redirect('/');
    })
}