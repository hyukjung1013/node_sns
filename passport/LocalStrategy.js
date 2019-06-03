const LocalStrategy = require('passport-local');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        console.log('LOCALSTRATEGY: ');
        var dummyUser = {
            email: 'dummy@dummy.com',
            password: 'dummy'
        };

        if ( email === dummyUser.email && password === dummyUser.password ) {
            done(null, dummyUser);
        } else {
            done(null, false, { message: 'User information is not correct.'});
        }
    }));
}