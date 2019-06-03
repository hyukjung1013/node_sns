const LocalStrategy = require('passport-local');
const db = require('../lowdb');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        var user = await db.get('users').find( { email: email, provider: 'local' }).value();
        if (user) {
            var result = await bcrypt.compare(password, user.password);
            if (result) {
                done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect Password' });
            }
        } else {
            done(null, false, { message: 'User does not exist.' });
        }
    }));
}