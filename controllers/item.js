// Model
const Item = require("../models/Item")
const User = require("../models/User")
const Review = require("../models/Review")


//HTTP GET - index:
function item_index_get(req, res) {
    let data = req.query.sort == "priceUp" ? { priceRate: 1 } : req.query.sort == "priceDown" ? { priceRate: -1 } : req.query.sort == "newest" ? { createdAt: -1 } : req.query.sort == "oldest" ? { createdAt: 1 } : {}
    const filter = {}
    if (req.query.category === 'home_appliances')
        filter.type = 'home appliances'
    if (req.query.category === 'electronics')
        filter.type = 'electronics'
    if (req.query.category === 'other')
        filter.type = 'other'

    if (req.query.condition === 'new')
        filter.condition = 'new'
    if (req.query.condition === 'good')
        filter.condition = 'good'
    if (req.query.condition === 'old')
        filter.condition = 'old'

    if (req.query.availability === 'available')
        filter.isAvailable = true
    if (req.query.availability === 'notAvailable')
        filter.isAvailable = false

    Item.find(filter).sort(data).populate('owner').populate('borrower').populate('review').populate('numOfReview')
        .then(items => {
            res.render("item/index", { items })
        })
        .catch(err => {
            req.session.flashMessage = err.message
            res.redirect('/item/index')
        })
}

//HTTP GET - detail:
function item_details_get(req, res) {
    Item.findById(req.query.id).populate('owner').populate('borrower').populate('review').populate('numOfReview')
        .then(item => {
            console.log(item)
            res.render("item/details", { item })
        })
        .catch(err => {
            req.session.flashMessage = err.message
            res.redirect('/item/index')
        })
}
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
//ADD
// HTTP GET - ADD
function item_create_get(req, res) {
    res.render("item/add")
}
// HTTP POST - ADD
function item_create_post(req, res) {
    const item = new Item(req.body);
    item.owner = req.user._id
    item.itemImage = req.file.filename
    item.save()
        .then(() => {
            res.redirect("/user/myprofile")
        })
        .catch((err) => {
            req.session.flashMessage = err.message
            res.redirect('/item/index')
        })
}

// HTTP GET - ADD Image
function item_addImg_get(req, res) {
    res.render("item/addImg")
}
// HTTP POST - ADD Image
function item_addImg_post(req, res) {
    Item.findById(req.query.id).populate('owner')
        .then(item => {
            if (item.owner.id == req.user._id) {
                item.itemImage = req.file.filename
                item.save()
                    .then(res.redirect('/user/myProfile'))
                    .catch(e => {
                        req.session.flashMessage = err.message
                        res.redirect('/item/index')
                    })
            } else {
                req.session.flashMessage = 'Sign in Please!'
                res.redirect('/auth/signin')
            }
        })
        .catch(e => res.send(e.message))
}
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
// BORROW
// HTTP GET - Borrow
function item_borrow_get(req, res) {
    Item.findById(req.query.id).populate('owner').populate('borrower')
        .then(item => {
            if (item.isAvailable)
                res.render("item/borrowItem", { item })
        })
        .catch(err => {
            req.session.flashMessage = err.message
            res.redirect('/item/index')
        })
}
// HTTP POST - Borrow
function item_borrow_post(req, res) {
    Item.findById(req.query.id)
        .then(item => {
            if (item.isAvailable) {
                User.findById(req.user._id)
                    .then(user => {
                        user.credit -= item.deposit
                        user.save()
                    })
                item.isAvailable = false
                item.borrower = req.user._id
                item.borrowDate = Date.now()
                item.save()
                res.render("user/myprofile", { item, user: req.user })
            }
        })
        .catch(err => {
            req.session.flashMessage = err.message
            res.redirect('/item/index')
        })
}
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
// RETURN
// HTTP GET - Return
function item_return_get(req, res) {
    Item.findById(req.query.id).populate('owner').populate('borrower')
        .then(item => {
            if (!item.isAvailable)
                res.render("item/returnItem", { item })
        })
        .catch(err => {
            req.session.flashMessage = 'Something went wrong'
            console.log(err);
            res.redirect('/item/index')
        })
}
// HTTP POST - Return
function item_return_post(req, res) {
    Item.findById(req.query.id)
        .then(item => {
            if (!item.isAvailable) {
                const balance = item.deposit - (
                    item.priceRate * Math.ceil(parseFloat(Date.now() - item.borrowDate) / (1000 * 60 * 60 * 24)))
                console.log(item.borrower.id)
                User.findById(item.borrower._id)
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
                    .then(res.redirect("/user/myprofile"))
                    .catch(err => {
                        req.session.flashMessage = 'Something went wrong'
                        console.log(err);
                        res.redirect('/item/index')
                    })
            }
        })
        .catch(err => {
            req.session.flashMessage = 'Something went wrong'
            console.log(err);
            res.redirect('/item/index')
        })
}
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
// EDIT
// HTTP GET - Edit
function item_edit_get(req, res) {
    Item.findById(req.query.id).populate('owner').populate('borrower')
        .then(item => {
            if (item.isAvailable)
                res.render("item/edit", { item })
        })
        .catch(err => {
            req.session.flashMessage = 'Something went wrong'
            console.log(err);
            res.redirect('/item/index')
        })
}
// HTTP POST - Edit
function item_edit_post(req, res) {
    const data = { itemName, description, priceRate, deposit, condition, type } = req.body
    Item.findByIdAndUpdate(req.query.id, data)
        .then((b) => {
            res.redirect("/user/myProfile");
        })
        .catch((err) => {
            req.session.flashMessage = 'Something went wrong'
            console.log(err);
            res.redirect('/item/index')
        })
}
///-
function item_edit2_get(req, res) {
    // Item.findOneAndUpdate(filter, update, { new: true })
    Item.findById(req.query.id).populate('owner').populate('borrower')
        .then(item => {
            if (item.isAvailable)
                res.render("item/edit2", { item })
        })
        .catch(err => {
            req.session.flashMessage = 'Something went wrong'
            console.log(err);
            res.redirect('/item/index')
        })
}
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
// DELETE
// HTTP GET - Delete
function item_delete_get(req, res) {
    Item.findOneAndDelete({ _id: req.query.id, isAvailable: true, owner: req.user._id }, function (err, docs) {
        if (err) {
            req.session.flashMessage = 'Something went wrong'
            console.log(err);
            res.redirect('/item/index')
        }
        else {
            res.redirect('/user/myprofile')
        }
    })
}

module.exports = {
    item_index_get,
    item_details_get,
    item_create_get,
    item_create_post,
    item_addImg_get,
    item_addImg_post,
    item_borrow_get,
    item_borrow_post,
    item_return_get,
    item_return_post,
    item_edit_get,
    item_edit_post,
    item_delete_get,
    item_edit2_get
}