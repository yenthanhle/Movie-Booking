const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)
// const ObjectId = Schema.ObjectId;

const schema = new Schema(
  {
    name: String,
    genre: String,
    duration: Number,
    release_date: Date,
    director: String,
    actor: String,
    description: String,
    rating: Number,
    sold_ticket: Number,
    poster: String,
    trailer: String,
    slug: { type: String, slug: 'name', unique: true },
  },
  {
    timestamps: true,
    collection: 'movie',
  },
)

module.exports = mongoose.model('Movies', schema)
