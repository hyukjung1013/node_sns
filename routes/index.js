const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const { Post, User } = require('../models');
const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
    Post.findAll({
        include: {
            model: User,
            attribute: ['id', 'nickname']
        },
        order: [['createdAt', 'DESC']]
    }).then((posts) => {
        console.log('POSTPOST: ', posts);
        res.render('main', {
            user: req.user,
            posts: posts
        });
    }).catch((error) => {
        console.error(error);
        next(error);
    });
});

module.exports = router;