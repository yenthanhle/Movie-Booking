const customerController = require('../app/controllers/CustomerController')
const express = require('express')
const router = express.Router()

router.put('/account/:_id/edit', customerController.updateAccount)
router.get('/bill', customerController.showBillList)
router.get('/account', customerController.index)
module.exports = router
