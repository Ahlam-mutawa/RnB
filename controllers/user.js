const User = require('../models/User')



//HTTP GET - All profile:
exports.user_profile_get = (req, res) => {
    User.find()
        .then(users => {
            res.render("user/list", { users })
        })
        .catch(err => {
            console.log(err);
        })
}


//HTTP GET - profile by ID :
exports.user_detail_get = (req, res) => {
    User.findById(req.query.id).populate('item').populate('borrowedItem')
        .then(user => {
            res.render("user/detail", { user });
        })
        .catch(err => {
            console.log(err);
        })
}


//HTTP GET - Current user profile :
exports.user_currentDetail_get = (req, res, next) => {
    var user = req.user;
    User.findById(user)
        .then(user => {
            res.render("user/myProfile", { user });
        })
        .catch(err => {
            console.log(err);
        })
}


//HTTP GET - load edit form :
exports.user_edit_get = (req, res) => {

    User.findByIdAndUpdate(req.query.id)
        .then(user => {
            res.render("user/edit", { user });
        })
        .catch(err => {
            console.log(err);
        })
}

// HTTP POST - to post the edit data 
exports.user_edit_post = (req, res) => {
    console.log(req.body)
    User.findByIdAndUpdate(req.body.id, req.body)


        .then(() => {
            res.redirect("/user/myProfile");
        })
        .catch((err) => {
            console.log(err);
            res.send("Please try again later!!!");
        })

}






