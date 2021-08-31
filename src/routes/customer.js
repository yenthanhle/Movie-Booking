const customerController = require('../app/controllers/CustomerController')
const express = require('express')
const router = express.Router()

router.put('/account/:_id/edit', customerController.putEditAccount)
router.get('/bill', customerController.getBillList)
router.get('/account', customerController.getAccount)
module.exports = router
