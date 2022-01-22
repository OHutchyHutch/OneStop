const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../models');
const session = require('express-session');
var SequelizeStore = require("connect-session-sequelize")(session.Store);

const store = new SequelizeStore({ db: db.sequelize });
router.use(session({
    secret: "keyboard cat",
    saveUninitialized: false,
    store,
    resave: false
}));

const upload = multer({ dest: './models/tmpbanners' });
const bucketController = require('../controllers/bucketController');
const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');
const serverController = require('../controllers/serverController');
const adminController = require('../controllers/adminController');
const statusController = require('../controllers/statusController');


router.get('/', async (req, res) => {
    var servers = await serverController.getAllServers();
    res.render('home', { loggedIn: req.session.isAuth, servers: servers });
});

router.get('/login', function (req, res) {
    req.query.alert ? res.render('user/login', { alert: req.query.alert }) : res.render('user/login')
});
router.get('/createaccount', function (req, res) {
    req.query.alert ? res.render('user/createaccount', { alert: req.query.alert }) : res.render('user/createaccount')
});
router.post('/createaccount', userController.newUser);
router.post('/login', userController.login)
router.get('/logout', sessionController.endSession);
router.get('/user/profile', userController.getServersOwnedByUser);
router.get('/user/settings', userController.getUserSettings);
router.get('/servers/profile/:serverid', serverController.serverProfile)
router.get('/servers/add', serverController.addServerGET);
router.post('/servers/add', upload.single('serverbanner'), serverController.addServerPOST);
router.get('/servers/delete/:serverid', serverController.deleteServer);
router.get('/servers/edit/:serverid', serverController.editServerGet);
router.post('/servers/edit/:serverid', upload.single('serverbanner'), serverController.editServer);
router.get('/servers/vote/:serverid', statusController.serverVoteGet);
router.post('/servers/vote/:serverid', statusController.serverVotePost);
router.get('/serverbanners/:key', (req, res) => { bucketController.getFile(req.params.key).pipe(res) });
router.get('/admin', function (req, res) { res.render('admin/loginadmin') });
router.post('/admin', adminController.login)
router.get('/admin/dashboard', adminController.access)
router.get('/admin/dashboard/database', adminController.database)
router.post('/admin/dashboard/tags', adminController.saveTags)
// router.get('*', function (req, res) {
//     var session = req.app.sessions;
//     res.render('404', { loggedIn: session.userid });
// });

module.exports = router;