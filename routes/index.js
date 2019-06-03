const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
    res.render('main', { user: req.user });
});

module.exports = router;