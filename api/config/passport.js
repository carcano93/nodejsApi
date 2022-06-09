const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('Users')

passport.use(new LocalStrategy({
    usernameField: 'name'
}, (user, passw, done) => {
    User.findOne({ name: user }, (err, user) => {
        if (err) { return done(err) }
        if (!user) {
            return done(null, false, {
                message: 'Bad user or password'
            });
        }
        if (!user.validatePassw(passw)) {
            return done(null, false, {
                message: 'Bad user or password'
            });
        }
        return done(null, user);
    });
}));