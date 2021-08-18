const Movie = require('../models/movie')
const {
  multiMongooseToMoviesObject,
  mongooseToMovieObject,
  multiMongooseToObject,
} = require('../util/mongoose')
class MoviesController {
  index(req, res) {
    res.render('movies/movies')
  }
  detail(req, res) {
    Movie.findOne({ slug: req.params.slug }, function (err, movie) {
      // docs.forEach
      res.render('movies/moviesDetail', { movie: mongooseToMovieObject(movie) })
    })
  }

  getCommingMovies(req, res) {
    const today = new Date()
    Movie.find({ release_date: { $gte: today } }, function (err, movies) {
      res.render('movies/movies', {
        movies: multiMongooseToMoviesObject(movies),
      })
    })
  }
  getShowingMovies(req, res) {
    const today = new Date()
    Movie.find({ release_date: { $lte: today } }, function (err, movies) {
      res.render('movies/movies', {
        movies: multiMongooseToMoviesObject(movies),
      })
    })
  }
}

module.exports = new MoviesController()
