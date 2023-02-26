const express = require('express')
const router = express.Router()
router.use(express.urlencoded({ extended: true }))

const itemCntrl = require('../controllers/item')


//Call API
router.get('/add', itemCntrl.item_create_get)
router.post('/add', itemCntrl.item_create_post)
router.get('/index', itemCntrl.item_index_get)

//exports:
module.exports = router;