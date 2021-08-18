const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timeZone = require('mongoose-timezone')
// const slug = require('mongoose-slug-generator');
// mongoose.plugin(slug)
const ObjectId = Schema.ObjectId

const schema = new Schema(
  {
    theater_id: {
      type: Schema.Types.ObjectId,
      ref: 'theater',
    },
    movie_id: {
      type: Schema.Types.ObjectId,
      ref: 'movie',
    },
    time: Date,
    room: String,
    subDocument: {
      subDate: {
        type: Date,
      },
    },

    // If no path is given, all date fields will be applied
  },
  {
    timestamps: true,
    collection: 'timeline',
  },
)
schema.plugin(timeZone, { paths: ['date', 'subDocument.subDate'] })
module.exports = mongoose.model('Timelines', schema)
