const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timeZone = require('mongoose-timezone')
// const slug = require('mongoose-slug-generator');
// mongoose.plugin(slug)
const ObjectId = Schema.ObjectId

const schema = new Schema(
  {
    user_id: String,
    timeline_id: {
      type: Schema.Types.ObjectId,
      ref: 'timeline',
    },
    time_created: Date,
    seat_count: Number,
    seat_name: String,
    payment: Number,
    subDocument: {
      subDate: {
        type: Date,
      },
    },

    // If no path is given, all date fields will be applied
  },
  {
    timestamps: true,
    collection: 'order',
  },
)
schema.plugin(timeZone, { paths: ['date', 'subDocument.subDate'] })
module.exports = mongoose.model('Order', schema)
