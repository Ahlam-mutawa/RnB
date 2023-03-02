const passport = require('passport')
const User = require('../models/User')

const LocalStrategy = require('passport-local').Strategy

// This saves the ID in the session
passport.serializeUser(function (user, done) {
    done(null, user.id)
})

// Retrieves the user from the database according to the ID from the session
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})

passport.use(new LocalStrategy({
    usernameField: 'emailAddress',
    passwordField: 'password'
},
    function (emailAddress, password, done) {
        User.verify(emailAddress, password)
            .then((user) => { return done(null, user) })
            .catch(e => {
                console.log(e);
                return done(null, false, { message: e.message })
            })
    }
))

module.exports = passport