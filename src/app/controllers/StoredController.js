const Movies = require('../models/movie')
const Theaters = require('../models/theater')
const Timeline = require('../models/timeline')
const async = require('async')
const {
  multiMongooseToMoviesObject,
  mongooseToMovieObject,
  multiMongooseToObject,
  mongooseToObject,
  mongooseDateToTime,
  mongooseDateToDate,
} = require('../util/mongoose')
class StoredController {
  index(req, res) {
    Movies.find({}, function (err, movies) {
      res.render('stored/listMovie', {
        movies: multiMongooseToMoviesObject(movies),
      })
    })
  }
  createMovie(req, res) {
    res.render('stored/createMovie')
  }
  storeMovie(req, res) {
    const formData = req.body
    const movie = new Movies(formData)
    movie.save()
    res.redirect('/stored/movies')
  }
  editMovie(req, res, next) {
    Movies.findById(req.params._id)
      .then((movie) =>
        res.render('stored/editMovie', { movie: mongooseToMovieObject(movie) }),
      )
      .catch(next)
  }
  updateMovie(req, res, next) {
    Movies.updateOne({ _id: req.params._id }, req.body)
      .then(() => res.redirect('/stored/movies'))
      .catch(next)
  }
  showTimeline(req, res) {
    const searchFunc = function search(input, cb) {
      async.parallel(
        {
          movie: function (callback) {
            Movies.findById(input.movie_id, callback)
          },
          theater: function (callback) {
            Theaters.findById(input.theater_id, callback)
          },
        },
        function (err, result) {
          var resultTemp = { ...result }
          resultTemp._id = input._id
          // convert id to name
          resultTemp.movie = result.movie.name
          resultTemp.theater = result.theater.name
          resultTemp.time = input.time
          resultTemp.room = input.room
          return cb(resultTemp)
        },
      )
    }

    Timeline.find({}, function (err, timelines) {
      var result = []
      var timelineList = multiMongooseToObject(timelines)
      timelineList.map((timeline) =>
        searchFunc(timeline, (params) => {
          // convert date in mongoose to time and date
          // console.log('Time: ', params.time)
          params.date = params.time.toLocaleDateString('en-CA')
          params.time = mongooseDateToTime(params.time)
          result.push({ ...params })
        }),
      )
      res.render('stored/listTimeline', { timelines: result })
    })
  }
  createTimeline(req, res) {
    async.parallel(
      {
        movieList: function (callback) {
          Movies.find({}, callback)
        },
        theaterList: function (callback) {
          Theaters.find({}, callback)
        },
      },
      function (err, results) {
        results.movieList = multiMongooseToMoviesObject(results.movieList)
        results.theaterList = multiMongooseToObject(results.theaterList)
        res.render('stored/createTimeline', { results })
      },
    )
  }

  storeTimeline(req, res) {
    const formData = req.body
    formData.time = new Date(formData.date + ' ' + formData.time)
    delete formData.date
    const timeline = new Timeline(formData)
    timeline.save()
    res.redirect('/stored/movies')
  }
  editTimeline(req, res, next) {
    Timeline.findById(req.params._id)
      .then((result) => {
        const timeline = mongooseToObject(result)
        timeline.date = timeline.time.toLocaleDateString('en-CA')
        timeline.time = mongooseDateToTime(timeline.time)
        // console.log(timeline)
        res.render('stored/editTimeline', { timeline: timeline })
      })
      .catch(next)
  }

  updateTimeline(req, res, next) {
    const formData = req.body
    formData.time = new Date(formData.date + ' ' + formData.time)
    delete formData.date
    Timeline.updateOne({ _id: req.params._id }, formData)
      .then(() => res.redirect('/stored/timelines'))
      .catch(next)
  }
}

module.exports = new StoredController()
