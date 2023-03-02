const express = require('express')
const router = express.Router()
router.use(express.urlencoded({ extended: true }))
const isLoggedIn = require('../lib/isLoggedIn');
const itemCntrl = require('../controllers/item')
const upload = require('../lib/upload')

//Call API
router.get('/index', itemCntrl.item_index_get)
router.get('/details', itemCntrl.item_details_get)
//ADD
router.get('/add', isLoggedIn, itemCntrl.item_create_get)
router.post('/add', isLoggedIn, upload.single('itemImage'), itemCntrl.item_create_post)
// router.get('/addimg', isLoggedIn, itemCntrl.item_addImg_get)
//EDIT
router.get('/edit', isLoggedIn, itemCntrl.item_edit_get)
router.post('/edit/details', isLoggedIn, itemCntrl.item_edit_post)
router.post('/addimg', isLoggedIn, upload.single('itemImage'), itemCntrl.item_addImg_post)
router.post('/edit/image', isLoggedIn, upload.single('itemImage'), itemCntrl.item_edit_post)
//BORROW
router.get('/borrow', isLoggedIn, itemCntrl.item_borrow_get)
router.post('/borrow', isLoggedIn, itemCntrl.item_borrow_post)
//RETURN
router.get('/return', isLoggedIn, itemCntrl.item_return_get)
router.post('/return', isLoggedIn, itemCntrl.item_return_post)
//DELETE
router.get('/delete', isLoggedIn, itemCntrl.item_delete_get)

//exports:
module.exports = router;
