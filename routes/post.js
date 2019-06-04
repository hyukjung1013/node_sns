const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn, isNotLoggedin } = require('./middlewares');
const { User, Post } = require('../models');
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
    try {
        const post = await Post.create({
            content: req.body.content,
            img: `/uploads/${req.file.filename}`,
            userId: req.user.id
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router; 