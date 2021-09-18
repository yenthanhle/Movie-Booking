const Movie = require('../models/movie')
const { multiMongooseToMoviesObject } = require('../util/mongoose')

class HomeController {
  // [GET] /
  index(req, res) {
    res.render('home')
  }
  // [GET] /comming-soon
  getCommingMovies(req, res) {
    let today = new Date()
    const year = today.getFullYear()
    const month =
      today.getMonth() + 1 <= 9
        ? '0' + (today.getMonth() + 1)
        : today.getMonth() + 1
    const date =
      today.getDate() + 1 <= 9
        ? '0' + (today.getDate() + 1)
        : today.getDate() + 1
    today = year + '-' + month + '-' + date
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
    let today = new Date()
    const year = today.getFullYear()
    const month =
      today.getMonth() + 1 <= 9
        ? '0' + (today.getMonth() + 1)
        : today.getMonth() + 1
    const date =
      today.getDate() + 1 <= 9
        ? '0' + (today.getDate() + 1)
        : today.getDate() + 1
    today = year + '-' + month + '-' + date
    // console.log(today >= '2021-04-02')
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
