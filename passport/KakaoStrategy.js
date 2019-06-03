const KakaoStrategy = require('passport-kakao').Strategy;
const db = require('../lowdb');
const shortId = require('shortid');

var kakaoConfig = require('./config/kakao.json');
module.exports = (passport) => {
    passport.use(new KakaoStrategy(kakaoConfig, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                var exUser = await db.get('users').find( { snsId: profile.id, provider: 'kakao'} ).value();
                if (exUser) {
                    done(null, exUser);
                } else {
                    const newUser = {
                        id: shortId.generate(),
                        snsId: profile.id,
                        provider: 'kakao',
                        nickname: profile.displayName,
                    }
                    done(null, newUser);
                    db.get('users').push(newUser).write();
                }
            } catch (err) {
                console.error(err);
                done(err);
            }
        }));
};  