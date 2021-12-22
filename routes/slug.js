const slugs = new Set(['home', 'login', 'createaccount', 'logout'])

const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');


router.get('/', function (req, res) {
    var session = req.app.sessions;
    res.render('home', { loggedIn: session.userid});
    
});

router.get('/login', function (req, res) {
    if(req.query.alert){
        let alert = req.query.alert;
        res.render('login', {alert: alert});
    }
    else {
        res.render('login', {alert: null})
    }
    
});
router.get('/createaccount', function (req, res) {
    if(req.query.alert){
        let alert = req.query.alert;
        res.render('createaccount', {alert: alert});
    }
    else {
        res.render('createaccount', {alert: null})
    }
});
router.post('/createaccount', userController.newUser);
router.post('/login', userController.validateUser);
router.get('/logout', userController.logoutUser);


router.get('*', function(req, res){
    var session = req.app.sessions;
    res.render('404', { loggedIn: session.userid});
  });
module.exports = router;