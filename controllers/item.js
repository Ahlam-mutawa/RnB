// Model
const Item = require("../models/Item")
const User = require("../models/User")
const Review = require("../models/Review")

// HTTP GET - Load item Form
exports.item_create_get = (req, res, next) => {
    res.render("item/add")
}

// HTTP POST - to post the data 
exports.item_create_post = (req, res) => {
    console.log(req.file.filename)
    const item = new Item(req.body);
    item.owner = req.user._id
    //Save Item in database 
    item.save()
        .then(() => {
            res.redirect("/user/myProfile");
        })
        .catch((err) => {
            console.log(err);
            res.send("Please try again later!!!");
        })
}

//HTTP GET - index:
exports.item_index_get = (req, res) => {
    Item.find().populate('owner').populate('borrower').populate('review').populate('numOfReview')
        .then(items => {
            res.render("item/index", { items })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.item_details_get = (req, res) => {
    Item.findById(req.query.id).populate('owner').populate('borrower').populate('review').populate('numOfReview')
        .then(item => {
            res.render("item/details", { item })
        })
        .catch(err => console.log(err))
}
exports.item_borrow_get = (req, res) => {
    Item.findById(req.query.id).populate('owner').populate('borrower')
        .then(item => {
            if (item.isAvailable)
                res.render("item/borrowItem", { item, user: req.user })
        })
        .catch(err => console.log(err))
}
exports.item_borrow_post = (req, res) => {
    Item.findById(req.query.id)
        .then(item => {
            if (item.isAvailable) {
                User.findById(req.user._id)
                    .then(user => {
                        user.credit -= item.dopiste
                        user.save()
                    })
                item.isAvailable = false
                item.borrower = req.user._id
                item.borrowDate = Date.now()
                item.save()
                res.render("item/borrowItem", { item, user: req.user })
            }
        })
        .catch(err => console.log(err))
}
exports.item_return_get = (req, res) => {
    Item.findById(req.query.id).populate('owner').populate('borrower')
        .then(item => {
            if (!item.isAvailable)
                res.render("item/returnItem", { item, user: req.user })
        })
        .catch(err => console.log(err))
}
exports.item_return_post = (req, res) => {
    Item.findById(req.query.id)
        .then(item => {
            if (!item.isAvailable) {
                const balance = item.dopiste - (
                    item.priceRate * Math.ceil((Date.now() - item.borrowDate) / (1000 * 60 * 60 * 24)))
                User.findById(item.borrower)
                    .then(user => {
                        user.credit += balance
                        user.save()
                    })
                    .catch(e => console.log(e.message))
                item.isAvailable = true
                item.borrower = null
                item.borrowDate = null
                item.save()
                const data = req.body
                data.score = parseInt(req.body.score)
                data.creatorId = req.user._id
                data.item = item._id
                const review = new Review(data)
                review.save()
                    .then(res.redirect("/"))
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
}