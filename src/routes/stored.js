const storedController = require('../app/controllers/StoredController')
const express = require('express')
const router = express.Router()

router.get('/movies/create', storedController.getCreateMovie)
router.post('/movies/create', storedController.postCreateMovie)
router.get('/movies/:_id/edit', storedController.getEditMovie)
router.put('/movies/:_id', storedController.putEditMovie)
router.delete('/movies/:_id', storedController.postDeleteMovie)
router.get('/timelines/create', storedController.getCreateTimeline)
router.post('/timelines/create', storedController.postCreateTimeline)
router.get('/timelines/:_id/edit', storedController.getEditTimeline)
router.put('/timelines/:_id', storedController.putEditTimeline)
router.delete('/timelines/:_id', storedController.postDeleteTimeline)
router.get('/timelines', storedController.getTimelines)
router.get('/movies', storedController.getMovies)

module.exports = router
