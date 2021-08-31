// const bookingController = require('../app/controllers/LoginController')
const accountController = require('../app/controllers/AuthController')
const express = require('express')
const router = express.Router()

router.get('/signup', accountController.getSignup)
router.post('/signup', accountController.postSignup)
router.get('/signout', accountController.postLogout)
router.get('/login', accountController.getLogin)
router.post('/login', accountController.postLogin)
router.get('/verify/:token', accountController.getVerifyAccount)
router.get('/reset/:token', accountController.getNewPassword)
router.post('/reset/:token', accountController.postNewPassword)
router.get('/reset', accountController.getReset)
router.post('/reset', accountController.postReset)

module.exports = router
