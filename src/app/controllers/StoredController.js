const Movie = require('../models/movie')
const Theater = require('../models/theater')
const Timeline = require('../models/timeline')
const async = require('async')
const {
  multiMongooseToMoviesObject,
  multiMongooseToObject,
  mongooseToObject,
  mongooseDateToTime,
} = require('../util/mongoose')

class StoredController {
  index(req, res) {
    res.render('stored/mode', {
      pageTitle: 'Manage Mode',
      path: '/stored',
      // editing: editMode,
      isAuthenticated: req.session.isLoggedIn,
    })
  }
  // [GET] stored/movies
  getMovies(req, res) {
    Movie.find({})
      .then((movies) => {
        res.render('stored/listMovie', {
          movies: multiMongooseToMoviesObject(movies),
          pageTitle: 'Show Movie List',
          path: '/stored/movies',
          // editing: editMode,
          isAuthenticated: req.session.isLoggedIn,
        })
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [GET] stored/movies/create
  getCreateMovie(req, res) {
    res.render('stored/createMovie', {
      pageTitle: 'Create Movie',
      path: '/stored/movies/create',
      // editing: editMode,
      isAuthenticated: req.session.isLoggedIn,
    })
  }
  // [POST] stored/movies/create
  postCreateMovie(req, res, next) {
    const formData = req.body
    const movie = new Movie(formData)
    movie
      .save()
      .then(() => res.redirect('/stored/movies'))
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [GET] stored/movies/:_id/edit
  getEditMovie(req, res, next) {
    Movie.findById(req.params._id)
      .then((movie) => {
        res.render('stored/editMovie', {
          movie: mongooseToObject(movie),
          pageTitle: 'Edit Movie',
          path: '/stored/movies/:id/edit',
          // editing: editMode,
          isAuthenticated: req.session.isLoggedIn,
        })
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [PUT] stored/movies/:_id
  putEditMovie(req, res, next) {
    Movie.updateOne({ _id: req.params._id }, req.body)
      .then(() => res.redirect('/stored/movies'))
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [DELETE] stored/movies/:_id
  postDeleteMovie(req, res, next) {
    const movieId = req.params._id
    Movie.deleteOne({ _id: movieId })
      .then(() => res.redirect('/stored/movies'))
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [GET] stored/timelines
  getTimelines(req, res, next) {
    const searchFunc = function search(input, callback) {
      // find movie and theater name
      async.parallel(
        {
          movie: function (callback) {
            Movie.findById(input.movie_id, callback)
          },
          theater: function (callback) {
            Theater.findById(input.theater_id, callback)
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
          return callback(resultTemp)
        },
      )
    }

    Timeline.find({})
      .then((timelines) => {
        var result = []
        var timelineList = multiMongooseToObject(timelines)
        timelineList.map((timeline) =>
          searchFunc(timeline, (params) => {
            // convert date in mongoose to time and date
            params.date = params.time.toLocaleDateString('en-CA')
            params.time = mongooseDateToTime(params.time)
            result.push({ ...params })
          }),
        )
        res.render('stored/listTimeline', {
          timelines: result,
          pageTitle: 'Show Timeline List',
          path: '/stored/timelines',
          // editing: editMode,
          isAuthenticated: req.session.isLoggedIn,
        })
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [GET] stored/timelines/create
  getCreateTimeline(req, res, next) {
    async.parallel(
      {
        movieList: function (callback) {
          Movie.find({}, callback)
        },
        theaterList: function (callback) {
          Theater.find({}, callback)
        },
      },
      function (err, results) {
        results.movieList = multiMongooseToMoviesObject(results.movieList)
        results.theaterList = multiMongooseToObject(results.theaterList)
        res.render('stored/createTimeline', {
          results: results,
          pageTitle: 'Create Timeline',
          path: '/stored/timelines/create',
          // editing: editMode,
          isAuthenticated: req.session.isLoggedIn,
        })
      },
    )
  }
  // [POST] stored/timelines/create
  postCreateTimeline(req, res, next) {
    const formData = req.body
    formData.time = new Date(formData.date + ' ' + formData.time)
    delete formData.date
    const timeline = new Timeline(formData)
    timeline
      .save()
      .then(() => {
        res.redirect('/stored/timelines')
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [GET] stored/timelines/:_id/edit
  getEditTimeline(req, res, next) {
    Timeline.findById(req.params._id)
      .then((result) => {
        const timeline = mongooseToObject(result)
        timeline.date = timeline.time.toLocaleDateString('en-CA')
        timeline.time = mongooseDateToTime(timeline.time)
        res.render('stored/editTimeline', {
          timeline: timeline,
          pageTitle: 'Edit Timeline',
          path: '/stored/timelines/:id/edit',
          // editing: editMode,
          isAuthenticated: req.session.isLoggedIn,
        })
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [PUT] stored/timelines/:_id
  putEditTimeline(req, res, next) {
    const formData = req.body
    formData.time = new Date(formData.date + ' ' + formData.time)
    delete formData.date
    Timeline.updateOne({ _id: req.params._id }, formData)
      .then(() => res.redirect('/stored/timelines'))
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [DELETE] stored/timelines/:_id
  postDeleteTimeline(req, res, next) {
    const timelineId = req.params._id
    // console.log(timelineId)
    Timeline.deleteOne({ _id: timelineId })
      .then(() => res.redirect('/stored/timelines'))
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
}

module.exports = new StoredController()
