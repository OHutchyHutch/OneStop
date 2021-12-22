const slugs = new Set(['home', 'login', 'createaccount', 'logout'])

const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController')


router.get('/', function (req, res) {
    var session = req.app.sessions;
    res.render('home', { loggedIn: session.userid });

});

router.get('/login', function (req, res) {
    if (req.query.alert) {
        let alert = req.query.alert;
        res.render('login', { alert: alert });
    }
    else {
        res.render('login', { alert: null })
    }

});
router.get('/createaccount', function (req, res) {
    if (req.query.alert) {
        let alert = req.query.alert;
        res.render('createaccount', { alert: alert });
    }
    else {
        res.render('createaccount', { alert: null })
    }
});
router.post('/createaccount', userController.newUser);
router.post('/login', userController.login)
router.get('/logout', sessionController.endSession);
router.get('/user/servers/:userid', async function (req, res) {
    var session = await req.app.sessions;
    if (req.params.userid == session.userid) {
        const user = await userController.getUserByID(session.userid)
        res.render('profile', { loggedIn: session.userid, useremail: user.email })
    }
    else {
        res.render('404', { loggedIn: session.userid });
    }
});


router.get('*', function (req, res) {
    var session = req.app.sessions;
    res.render('404', { loggedIn: session.userid });
});
module.exports = router;