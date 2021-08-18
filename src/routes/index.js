const homeRouter = require('./home')
const storedRouter = require('./stored')
const customerRouter = require('./customers')
const movieRouter = require('./movies')
const bookingRouter = require('./booking')
const loginController = require('./login')
function route(app) {
  app.use('/stored', storedRouter)
  app.use('/customers', customerRouter)
  app.use('/movies', movieRouter)
  app.use('/booking', bookingRouter)
  // app.use('/login', loginController)
  app.use('/', homeRouter)
}

module.exports = route
