const Movie = require('../models/movie')
const { mongooseToMovieObject } = require('../util/mongoose')
class MoviesController {
  // [GET] movie/:slug
  getMovieDetail(req, res) {
    Movie.findOne({ slug: req.params.slug })
      .then((movie) => {
        res.render('movie/movieDetail', {
          movie: mongooseToMovieObject(movie),
          pageTitle: 'Show Movie Infor',
          path: '/movie/:slug',
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
}

module.exports = new MoviesController()
