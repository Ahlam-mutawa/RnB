const express = require('express')

const router = express.Router()

const reviewCntrl = require('../controllers/review')


//Review routes
router.get('/',reviewCntrl.review_index_get)
router.get('/add',reviewCntrl.review_add_get)
router.post('/add',reviewCntrl.review_add_post)




module.exports = router
