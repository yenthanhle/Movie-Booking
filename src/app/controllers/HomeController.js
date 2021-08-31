const Movie = require('../models/movie')
const { multiMongooseToMoviesObject } = require('../util/mongoose')

class HomeController {
  // [GET] /
  index(req, res) {
    res.render('home')
  }
  // [GET] /comming-soon
  getCommingMovies(req, res) {
    const today = new Date()
    Movie.find({ release_date: { $gte: today } })
      .then((movies) =>
        res.render('home', {
          movies: multiMongooseToMoviesObject(movies),
        }),
      )
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [GET] /showing-now
  getShowingMovies(req, res) {
    const today = new Date()
    Movie.find({ release_date: { $lte: today } })
      .then((movies) =>
        res.render('home', {
          movies: multiMongooseToMoviesObject(movies),
        }),
      )
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
}

module.exports = new HomeController()
