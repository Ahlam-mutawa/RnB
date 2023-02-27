//APIs
function index_get(req, res) {
    res.render('home/index')
}
function index_post(req, res) {
    console.log(req.file.filename)
    res.render('home/image', { image: req.file.filename })
}
function another_get(req, res) {
    res.render('home/another')
}

module.exports = { index_get, another_get, index_post }