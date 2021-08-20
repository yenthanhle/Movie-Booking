const homeController = require('../app/controllers/HomeController')
const express = require('express')
const router = express.Router()

router.get('/comming-soon', homeController.getCommingMovies)
router.get('/showing-now', homeController.getShowingMovies)
router.get('/', homeController.index)

module.exports = router
