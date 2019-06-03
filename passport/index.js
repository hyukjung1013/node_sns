const local = require('./LocalStrategy');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((email, done) => {
        var dummyUser = {
            email: email,
            password: 'dummyPassword'
        }
        done(null, dummyUser);
    });

    local(passport);
};