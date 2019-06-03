const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('main');
    if(req.user) {
        console.log('user exists.');
        res.render('main', { user: req.user });
    } else {
        console.log('user does not exists.');
        res.redirect('/auth/login');
    }
});

module.exports = router;