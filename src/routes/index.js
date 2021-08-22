const homeRouter = require('./home')
const storedRouter = require('./stored')
const customerRouter = require('./customer')
const movieRouter = require('./movie')
const bookingRouter = require('./booking')
const accountController = require('./account')
const authMiddlewares = require('../app/middlewares/AuthMiddleware')

function route(app) {
  app.use('/stored', authMiddlewares.requireAuth, storedRouter)
  app.use('/customer', customerRouter)
  app.use('/movie', movieRouter)
  app.use('/booking', bookingRouter)
  app.use('/account', accountController)
  app.use('/', homeRouter)
}

module.exports = route
