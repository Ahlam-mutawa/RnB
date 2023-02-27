const express = require('express')
const router = express()
// router.use(express.urlencoded({ extended: true }))
const paymentCntrl =  require('../controllers/payment')
// 

router.get('/', paymentCntrl.payment_index_get)
router.post('/', paymentCntrl.payment_index_post)



module.exports = router