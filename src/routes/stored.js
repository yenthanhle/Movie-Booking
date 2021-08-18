const storedController = require('../app/controllers/StoredController')
const express = require('express')
const router = express.Router()

router.get('/movies/createMovie', storedController.createMovie)
router.post('/movies/createMovie', storedController.storeMovie)
router.get('/timelines/createTimeline', storedController.createTimeline)
router.post('/timelines/createTimeline', storedController.storeTimeline)
router.get('/timelines/:_id/edit', storedController.editTimeline)
router.put('/timelines/:_id', storedController.updateTimeline)
router.get('/timelines', storedController.showTimeline)
router.get('/movies/:_id/edit', storedController.editMovie)
router.put('/movies/:_id', storedController.updateMovie)
router.get('/movies', storedController.index)

module.exports = router
