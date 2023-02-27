const User = require('../models/User');

exports.payment_index_get = (req, res) => {
    res.render("payment/index")
}

exports.payment_index_post = (req, res) => {
    let amount = parseInt(req.body.amount) 
    User.findById(req.user._id)
    .then(user => {
        user.credit+=amount
        user.save()
        res.redirect("/")
    })
    .catch(err => console.log(err))

}

