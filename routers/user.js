const express = require('express')
const router = express.Router()
const userCntrl = require('../controllers/user')
const isLoggedIn = require('../lib/isLoggedIn');
const upload = require('../lib/upload')

//CALL API:
router.get('/myProfile', isLoggedIn, userCntrl.user_myProfile_get)
router.get('/edit', isLoggedIn, userCntrl.user_edit_get)
router.post('/edit', isLoggedIn, userCntrl.user_edit_post)
router.post('/edit/img', isLoggedIn, upload.single('profileImage'), userCntrl.user_editImg_post)
router.post('/edit/password', isLoggedIn, userCntrl.user_updatePassword_post)
router.get('/detail', userCntrl.user_detail_get)
router.get('/list', userCntrl.user_profile_get)

//exports:
module.exports = router;
