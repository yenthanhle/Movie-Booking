const mongoose = require('mongoose')

const Schema = mongoose.Schema
// const slug = require('mongoose-slug-generator');
// mongoose.plugin(slug)
// const ObjectId = Schema.ObjectId;

const schema = new Schema(
  {
    name: String,
    //   slug: {type: String, slug: 'name', unique: true}
  },
  {
    timestamps: true,
    collection: 'theater',
  },
)

module.exports = mongoose.model('Theaters', schema)
