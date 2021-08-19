const customerController = require('../app/controllers/CustomerController')
const express = require('express')
const router = express.Router()

router.get('/account/edit', customerController.edit)
router.get('/account', customerController.index)

module.exports = router
