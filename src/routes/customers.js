const customerController = require('../app/controllers/CustomersController')
const express = require('express')
const router = express.Router()

router.get('/account/edit', customerController.edit)
router.get('/account', customerController.index)

router.get('/login', customerController.login)
router.post('/login', customerController.loginAccount)

router.get('/register', customerController.register)
router.post('/register', customerController.createAccount)
module.exports = router
