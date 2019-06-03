const local = require('./LocalStrategy');
const kakao = require('./KakaoStrategy');
const facebook = require('./FacebookStrategy');

const db = require('../lowdb');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        var user = db.get('users').find( { id: id } ).value();
        done(null, user);
    });

    local(passport);
    kakao(passport);
    facebook(passport);
};