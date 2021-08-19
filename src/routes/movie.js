const moviesController = require('../app/controllers/MovieController')
const express = require('express')
const router = express.Router()

router.get('/comming-soon', moviesController.getCommingMovies)
router.get('/showing-now', moviesController.getShowingMovies)
router.get('/:slug', moviesController.detail)

router.get('/', moviesController.index)

module.exports = router
