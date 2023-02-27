const express = require('express')
const router = express.Router()
const userCntrl = require('../controllers/user')
const isLoggedIn = require('../lib/isLoggedIn');


//CALL API:
router.get('/list', userCntrl.user_profile_get)
router.get('/detail', userCntrl.user_detail_get)
router.get('/myProfile', isLoggedIn, userCntrl.user_currentDetail_get)
router.get("/edit", userCntrl.user_edit_get);
router.post("/edit", userCntrl.user_edit_post);
// router.get('/profile/:id',userCntrl.user_profile_get)



//exports:
module.exports = router;
