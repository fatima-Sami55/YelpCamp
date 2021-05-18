const express = require('express');
const passport = require('passport');
const controllers = require('../controllers/auth')
const router = express.Router();

const wrapError = require('../helpers/errorWraper');

router.get('/register', controllers.renderRegister);

router.post('/register', wrapError(controllers.Register));

router.get('/login', controllers.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), controllers.login);

router.get('/logout', controllers.logout)

module.exports = router;