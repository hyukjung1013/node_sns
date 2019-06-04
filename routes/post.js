const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn, isNotLoggedin } = require('./middlewares');
const { User, Post, Hashtag } = require('../models');
const router = express.Router();

fs.readdir('uploads', (err) => {
    if(err) {
        console.error('upload directory does not exists.');
        console.error('upload directory is created.');
        fs.mkdirSync('uploads');
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, callback) {
            callback(null, 'uploads/');
        },
        filename(req, file, callback) {
            const external = path.extname(file.originalname);
            callback(null, path.basename(file.originalname, external) + new Date().valueOf() + external);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024}
});


router.post('/uploads_post', isLoggedIn, upload.single('img') , async (req, res, next) => {

    function getHashTags(inputText) {  
        var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
        var matches = [];
        var match;

        while ((match = regex.exec(inputText))) {
            matches.push(match[1]);
        }
        return matches;
    }

    try {
        const post = await Post.create({
            content: req.body.content,
            img: `/uploads/${req.file.filename}`,
            userId: req.user.id
        });

        // const hashtags = req.body.content.match(/#[^\s]*/g);
        const hashtags = getHashTags(req.body.content);
    
        if(hashtags) {
            const result = await Promise.all(hashtags.map(
                tag => Hashtag.findOrCreate({ where: { title: tag.toLowerCase() }})
            ));
            await post.addHashtags(result.map(r => r[0]));
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/hashtag', async(req, res, next) => {
    const query = req.query.hashtag;

    if (!query) {
        return res.redirect('/');
    }

    try {
        const hashtag = await Hashtag.findOne( { where: { title: query } } );
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts( { include: [ { model: User } ]} );
        }
        return res.render('main', {
            user: req.user,
            posts: posts
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router; 