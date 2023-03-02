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
module.exports = router