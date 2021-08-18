const bookingController = require('../app/controllers/BookingController')
const express = require('express')
const router = express.Router()

router.get('/:_id/detail', bookingController.detail)
router.post('/payment/confirm', bookingController.storePayment)
router.post('/payment', bookingController.showPayment)
router.get('/:_id', bookingController.index)

// router.get('/', bookingController.index)

module.exports = router
