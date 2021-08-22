const Movie = require('../models/movie')
const { multiMongooseToMoviesObject } = require('../util/mongoose')
const openSocket = require('socket.io-client')
class HomeController {
  index(req, res) {
    res.render('home')
    openSocket('http://localhost:3000')
  }
  getCommingMovies(req, res) {
    const today = new Date()
    Movie.find({ release_date: { $gte: today } }, function (err, movies) {
      res.render('home', {
        movies: multiMongooseToMoviesObject(movies),
      })
    })
  }
  getShowingMovies(req, res) {
    const today = new Date()
    Movie.find({ release_date: { $lte: today } }, function (err, movies) {
      res.render('home', {
        movies: multiMongooseToMoviesObject(movies),
      })
    })
  }
}

module.exports = new HomeController()
