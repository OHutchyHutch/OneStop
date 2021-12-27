const express = require('express');
const router = express.Router();
const multer = require('multer');


const upload = multer({ dest: './models/tmpbanners' });
const bucketController = require('../controllers/bucketController');
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
    else res.render('login')

});
router.get('/createaccount', function (req, res) {
    if (req.query.alert) {
        let alert = req.query.alert;
        res.render('createaccount', { alert: alert });
    }
    else res.render('createaccount')
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
router.get('/servers/add', function (req, res) {
    var session = req.app.sessions;
    let alert = req.query.alert;
    if (session.userid) res.render('editserver', { loggedIn: session.userid, alert: alert })
    else res.render('login', { alert: "notlogged" })
})
router.post('/servers/add', upload.single('serverbanner'), serverController.addServer);
router.get('/servers/delete/:serverid', serverController.deleteServer);
router.get('/servers/edit/:serverid', serverController.editServerGet);
router.post('/servers/edit/:serverid', upload.single('serverbanner'), serverController.editServer);
router.get('/serverbanners/:key', (req, res) => {
    const key = req.params.key
    const readStream = bucketController.getFile(key)
    readStream.pipe(res)
});
router.get('*', function (req, res) {
    var session = req.app.sessions;
    res.render('404', { loggedIn: session.userid });
});

module.exports = router;