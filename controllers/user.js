const { populate } = require('../models/User');
const User = require('../models/User')

//HTTP GET - my profile :
function user_myProfile_get(req, res, next) {
    User.findById(req.user._id).populate({ path: 'item', populate: { path: 'review' } }).populate('borrowedItem')
        .then(user => {
            res.render("user/myProfile", { user });
        })
        .catch(err => {
            console.log(err);
        })
}

//HTTP GET - load edit form :
function user_edit_get(req, res) {

    User.findByIdAndUpdate(req.user._id)
        .then(user => {
            res.render("user/edit", { user });
        })
        .catch(err => {
            console.log(err);
        })
}

// HTTP POST - Update my profile 
function user_edit_post(req, res) {
    const data = { firstName, lastName, telNumber } = req.body
    User.findByIdAndUpdate(req.user._id, data)
        .then(() => {
            res.redirect("/user/myProfile");
        })
        .catch((err) => {
            console.log(err);
            res.send("Please try again later!!!");
        })

}
// HTTP POST - Update my profile Picture
function user_editImg_post(req, res) {
    User.findByIdAndUpdate(req.user._id, { profileImage: req.file.filename })
        .then(() => {
            res.redirect("/user/myProfile");
        })
        .catch((err) => {
            console.log(err);
            res.send("Please try again later!!!");
        })

}
// HTTP POST - Update user passwword
function user_editPass_post(req, res) {
    User.findByIdAndUpdate(req.user._id, { profileImage: req.file.filename })
        .then(() => {
            res.redirect("/user/myProfile");
        })
        .catch((err) => {
            console.log(err);
            res.send("Please try again later!!!");
        })

}

//HTTP GET - user profile by ID :
function user_detail_get(req, res) {
    User.findById(req.query.id).populate({ path: 'item', populate: { path: 'review' } }).populate({ path: 'item', populate: { path: 'numOfReview' } }).populate('borrowedItem')
        .then(user => {
            res.render("user/detail", { user });
        })
        .catch(err => {
            console.log(err);
        })
}

//HTTP GET - All profile:
function user_profile_get(req, res) {
    User.find()
        .then(users => {
            res.render("user/list", { users })
        })
        .catch(err => {
            console.log(err);
        })
}
//HTTP GET - All profile:
function user_updatePassword_post(req, res) {
    const data = req.body
    data.id = req.user.id
    console.log(data)
    User.changePassword(data)
        .then(res.redirect('/auth/signout'))
        .catch(err => {
            console.log(err.message);
        })
}

module.exports = {
    user_edit_post,
    user_edit_get,
    user_myProfile_get,
    user_detail_get,
    user_detail_get,
    user_profile_get,
    user_profile_get,
    user_editImg_post,
    user_updatePassword_post
}