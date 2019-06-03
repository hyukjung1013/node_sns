const express = require('express');
const passport = require('passport');
const db = require('../lowdb');
const shortId = require('shortid');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 

const router = express.Router();

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login');
});

router.post('/login_process', isNotLoggedIn,
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    })
);

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.save(function() {
        res.redirect('/');
    });
});

router.get('/signup', isNotLoggedIn, (req, res) => {
    var msg = req.flash('join_error_msg');
    if(msg) {
        res.render('signup', { msg: msg });
    } else {
        res.render('signup', { msg: '' });
    }
});

router.post('/signup_process', isNotLoggedIn ,async (req, res) => {
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    var nickname = req.body.nickname;

    var exUser = db.get('users').find( { email: email } ).value();

    if (exUser) {
        req.flash('join_error_msg', 'Email already exists.');
        return res.redirect('/auth/signup');
    } else {
        var hash = await bcrypt.hash(password, 12);

        var user = {
            id: shortId.generate(),
            email: email,
            name: name,
            password: hash,
            nickname: nickname,
            provider: 'local'
        };

        db.get('users').push(user).write();

        req.login(user, function(err) {
            return res.redirect('/');
        });
    }
});

router.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/'
}));

router.get('/facebook', isNotLoggedIn, passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
}));

module.exports = router;