const express = require('express')
const router = express.Router()
router.use(express.urlencoded({ extended: true }))

const itemCntrl = require('../controllers/item')


//Call API
router.get('/add', itemCntrl.item_create_get)
router.post('/add', itemCntrl.item_create_post)
router.get('/index', itemCntrl.item_index_get)
router.get('/details', itemCntrl.item_details_get)
router.get('/borrow', itemCntrl.item_borrow_get)
router.post('/borrow', itemCntrl.item_borrow_post)
router.get('/return', itemCntrl.item_return_get)
router.post('/return', itemCntrl.item_return_post)

//exports:
module.exports = router;