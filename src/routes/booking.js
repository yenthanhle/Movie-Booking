const bookingController = require('../app/controllers/BookingController')
const authMiddlewares = require('../app/middlewares/AuthMiddleware')

const express = require('express')
const router = express.Router()

router.get('/:_id/detail', bookingController.index)
router.post(
  '/payment',
  authMiddlewares.requireAuth,
  bookingController.showPayment,
)
router.post(
  '/payment/confirm',
  authMiddlewares.requireAuth,
  bookingController.storePayment,
)
router.get('/:_id', authMiddlewares.requireAuth, bookingController.showTimeline)

// router.get('/', bookingController.index)

module.exports = router
