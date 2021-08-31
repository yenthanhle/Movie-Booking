const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb://localhost:27017/YT_Movies'

async function connect() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    console.log('Connect database successfully!!!')
  } catch (e) {
    console.log(e)
  }
}

module.exports = { connect }
