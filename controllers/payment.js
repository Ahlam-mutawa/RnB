const User = require('../models/User');

function payment_index_get(req, res) {
    res.render("payment/index", { user: req.user })
}

function payment_index_post(req, res) {
    let amount = parseInt(req.body.amount)
    User.findById(req.user._id)
        .then(user => {
            user.credit += amount
            user.save()
            res.redirect("/user/myProfile")
        })
        .catch(err => console.log(err))
}

module.exports = { payment_index_get, payment_index_post }