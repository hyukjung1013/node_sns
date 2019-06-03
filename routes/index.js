const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('main');
});

router.get('/profile', (req, res) => {
    res.render('profile');
});

module.exports = router;