const express = require('express');
const router = express.Router()
const indexCtrl = require('../controllers/index');
const isLoggedIn = require('../lib/isLoggedIn');
// const { ensureLoggedIn } = require('connect-ensure-login')
const upload = require('../lib/upload')
const connect = require('connect-ensure-login')

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//calling APIs

router.get('/', indexCtrl.index_get)
router.post('/upload/profile', upload.single('profileImage'), indexCtrl.index_post)
router.post('/upload/item', upload.single('itemImage'), indexCtrl.index_post)
router.get('/home/another', connect.ensureLoggedIn('/auth/signin'), indexCtrl.another_get)


module.exports = router