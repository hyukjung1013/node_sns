const local = require('./LocalStrategy');
const kakao = require('./KakaoStrategy');
const facebook = require('./FacebookStrategy');

const { User } = require('../models');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.dataValues.id);
    });

    passport.deserializeUser( async (id, done) => {
        try {
            var user = await User.findOne({ where: {id: id} });
            done(null, user);
        } catch (err) {
            console.log(err);
        }
    });

    local(passport);
    kakao(passport);
    facebook(passport);
};