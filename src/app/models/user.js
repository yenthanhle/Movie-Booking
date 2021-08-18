const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timeZone = require('mongoose-timezone')
// const slug = require('mongoose-slug-generator');
// mongoose.plugin(slug)
const ObjectId = Schema.ObjectId

const schema = new Schema(
  {
    user_name: String,
    password: String,
    gender: String,
    date_of_birth: String,
    phone_number: String,
    address: String,
    // If no path is given, all date fields will be applied
  },
  {
    timestamps: true,
    collection: 'user',
  },
)
module.exports = mongoose.model('Users', schema)
