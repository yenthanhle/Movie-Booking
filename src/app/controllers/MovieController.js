const Movie = require('../models/movie')
const { mongooseToMovieObject } = require('../util/mongoose')
class MoviesController {
  // index(req, res) {
  //   res.render('home')
  // }
  detail(req, res) {
    Movie.findOne({ slug: req.params.slug }, function (err, movie) {
      // docs.forEach
      res.render('movie/moviesDetail', { movie: mongooseToMovieObject(movie) })
    })
  }
}

module.exports = new MoviesController()
