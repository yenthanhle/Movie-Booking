const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timeZone = require('mongoose-timezone')
// const slug = require('mongoose-slug-generator');
// mongoose.plugin(slug)
const ObjectId = Schema.ObjectId

const schema = new Schema(
  {
    user_name: String,
    email: String,
    password: String,
    resetToken: String,
    resetTokenExpiration: Date,
    gender: String,
    date_of_birth: String,
    phone_number: String,
    address: String,
    verifyToken: String,
    isActive: Boolean,
    subDocument: {
      subDate: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
    collection: 'user',
  },
)
schema.plugin(timeZone, { paths: ['date', 'subDocument.subDate'] })
module.exports = mongoose.model('Users', schema)
