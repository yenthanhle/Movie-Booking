const bookingController = require('../app/controllers/LoginController')
const express = require('express')
const router = express.Router()

router.get('/', bookingController.index)
router.post('/', bookingController.createAccount)

// router.get('/', bookingController.index)

module.exports = router
