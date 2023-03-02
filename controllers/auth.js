const bcrypt = require('bcrypt');
const User = require('../models/User')
const passport = require('../lib/passportConfig')
function auth_signup_get(req, res) {
    res.render('auth/signup')
}

async function auth_signup_post(req, res, next) {
    User.isValid(req.body)
        .then((result) => {
            const user = new User(result)
            user.save()
                .then(() => res.redirect('/auth/signin'))
                .catch((e) => {
                    req.session.flashMessage = e.message
                    res.redirect('/auth/signup')
                })
        })
        .catch(e => {
            req.session.flashMessage = e.message
            res.redirect('/auth/signup')

        })
}

function auth_signin_get(req, res) {
    res.render('auth/signin')
}
const auth_signin_post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/signin',
})

function auth_signout_get(req, res) {
    req.logout(function (err) {
        if (err) {
            req.session.flashMessage = err.message
            return next(err)
        }
        res.redirect('/')
    })
}




module.exports = { auth_signup_get, auth_signup_post, auth_signin_get, auth_signin_post, auth_signout_get }