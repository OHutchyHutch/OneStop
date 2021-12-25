const express = require('express');
const router = express.Router();
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './models/serverbanners')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + ".gif")
    }
})

const upload = multer({ dest: './models/serverbanners' });

const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');
const serverController = require('../controllers/serverController');


router.get('/', function (req, res) {
    var session = req.app.sessions;
    res.render('home', { loggedIn: session.userid });

});

router.get('/login', function (req, res) {
    if (req.query.alert) {
        let alert = req.query.alert;
        res.render('login', { alert: alert });
    }
    else res.render('login', { alert: null })

});
router.get('/createaccount', function (req, res) {
    if (req.query.alert) {
        let alert = req.query.alert;
        res.render('createaccount', { alert: alert });
    }
    else res.render('createaccount', { alert: null })
});
router.post('/createaccount', userController.newUser);
router.post('/login', userController.login)
router.get('/logout', sessionController.endSession);
router.get('/user/servers/:userid', async function (req, res) {
    var session = await req.app.sessions;
    if (req.params.userid == session.userid) {
        //const user = await userController.getUserByID(session.userid)
        const servers = await serverController.findServersByUser(session.userid)
        res.render('profile', { loggedIn: session.userid, servers: servers })
    }
    else res.render('404', { loggedIn: session.userid });
});
router.get('/server/add', function (req, res) {
    var session = req.app.sessions;
    let alert = req.query.alert;
    if (session.userid) res.render('createserver', { loggedIn: session.userid, alert: alert })
    else res.render('login', { alert: "notlogged" })
})
router.post('/server/add', upload.single('serverbanner'), serverController.addServer);
router.get('*', function (req, res) {
    var session = req.app.sessions;
    res.render('404', { loggedIn: session.userid });
});
module.exports = router;