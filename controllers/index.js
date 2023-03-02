const User = require('../models/User')

//APIs
function index_get(req, res) {
    res.render('home/index')
}
module.exports = { index_get }