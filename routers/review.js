const express = require('express')
const router = express.Router()
const isLoggedIn = require('../lib/isLoggedIn');
const reviewCntrl = require('../controllers/review')


//Review routes
router.get('/', isLoggedIn, reviewCntrl.review_index_get)
router.get('/add', isLoggedIn, reviewCntrl.review_add_get)
router.post('/add', isLoggedIn, reviewCntrl.review_add_post)




module.exports = router
