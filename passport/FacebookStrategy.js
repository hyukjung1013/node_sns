const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../lowdb');
const shortId = require('shortid');

var facebookConfig = require('./config/facebook.json');
module.exports = (passport) => {
    passport.use(new FacebookStrategy(facebookConfig, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                var exUser = await db.get('users').find( { snsId: profile.id, provider: 'facebook'} ).value();
                if (exUser) {
                    done(null, exUser);
                } else {
                    const newUser = {
                        id: shortId.generate(),
                        snsId: profile.id,
                        provider: 'facebook',
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