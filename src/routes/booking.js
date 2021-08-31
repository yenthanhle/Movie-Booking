const bookingController = require('../app/controllers/BookingController')
const authMiddlewares = require('../app/middlewares/AuthMiddleware')

const express = require('express')
const router = express.Router()

router.get('/:_id/detail', bookingController.getBookingDetail)
router.post(
  '/payment',
  authMiddlewares.requireAuth,
  bookingController.getPayment,
)
router.post(
  '/payment/confirm',
  authMiddlewares.requireAuth,
  bookingController.postPayment,
)
router.get('/:_id', authMiddlewares.requireAuth, bookingController.getTimeline)

// router.get('/success', bookingController.getSuccess)
// router.get('/cancel', bookingController.showCancel)
// router.get('/', bookingController.index)

module.exports = router
