// const bookingController = require('../app/controllers/LoginController')
const accountController = require('../app/controllers/AccountController')
const express = require('express')
const router = express.Router()

router.get('/register', accountController.register)
router.post('register', accountController.createAccount)
router.get('/sign-out', accountController.signout)
router.get('/', accountController.index)
router.post('/', accountController.login)

module.exports = router
