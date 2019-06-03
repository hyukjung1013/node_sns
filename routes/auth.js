const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login_process', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    req.session.save(function() {
        res.redirect('/');
    });
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;