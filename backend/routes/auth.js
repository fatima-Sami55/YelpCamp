const express = require('express');
const passport = require('passport');
const controllers = require('../controllers/auth')
const router = express.Router();

const wrapError = require('../helpers/errorWraper');

router.post('/register', wrapError(controllers.Register));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ error: info?.message || 'Invalid username or password' });
        }

        req.user = user;
        next();
    })(req, res, next);
}, controllers.login);

router.get('/currentUser', controllers.currentUser);

module.exports = router;
