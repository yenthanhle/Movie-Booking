const moviesController = require('../app/controllers/MovieController')
const express = require('express')
const router = express.Router()

router.get('/:slug', moviesController.detail)

module.exports = router
