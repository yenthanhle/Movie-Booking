const Movie = require('../models/movie')
const Theater = require('../models/theater')
const async = require('async')

module.exports = {
  multiMongooseToMoviesObject: (mongooseMovies) =>
    mongooseMovies.map(function (mongooseMovie) {
      mongooseMovie = mongooseMovie.toObject()
      // change format date
      mongooseMovie['release_date'] = new Date(
        mongooseMovie['release_date'],
      ).toLocaleDateString()
      return mongooseMovie
    }),
  mongooseToMovieObject: function (mongooseMovie) {
    mongooseMovie = mongooseMovie.toObject()
    // change format date
    mongooseMovie['release_date'] = new Date(
      mongooseMovie['release_date'],
    ).toLocaleDateString()
    return mongooseMovie
  },
  multiMongooseToObject: (mongooses) =>
    mongooses.map((mongoose) => mongoose.toObject()),
  mongooseToObject: (mongoose) => mongoose.toObject(),
  mongooseDateToTime: (date) => {
    date.setHours(date.getHours() + 7)
    return date.toLocaleTimeString().slice(0, 5)
  },
  mongooseDateToDate: (date) => date.toLocaleDateString(),

  getTheaterName: (id, cb) => {
    Theater.findById(id).then((theater) => cb(theater.toObject()))
  },

  getTimelineInfor: (inputTimeline, callback) => {
    // find movie and theater name
    async.parallel(
      {
        movie: function (callback) {
          Movie.findById(inputTimeline.movie_id, callback)
        },
        theater: function (callback) {
          Theater.findById(inputTimeline.theater_id, callback)
        },
      },
      function (err, result) {
        var resultTemp = { ...result }
        resultTemp._id = inputTimeline._id
        // convert id to name
        resultTemp.movie_name = result.movie.name
        resultTemp.theater_name = result.theater.name
        resultTemp.date = inputTimeline.time.toLocaleDateString()
        resultTemp.time = inputTimeline.time
          .toLocaleTimeString()
          .split('')
          .slice(0, 5)
          .join('')
        resultTemp.room = inputTimeline.room
        return callback(resultTemp)
      },
    )
  },
}
