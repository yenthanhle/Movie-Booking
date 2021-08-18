const Theaters = require('../models/theater')

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
    Theaters.findById(id).then((theater) => cb(theater.toObject()))
  },
}
