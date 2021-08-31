const homeRouter = require('./home')
const storedRouter = require('./stored')
const customerRouter = require('./customer')
const movieRouter = require('./movie')
const bookingRouter = require('./booking')
const accountController = require('./auth')
const authMiddlewares = require('../app/middlewares/AuthMiddleware')

function route(app) {
  app.use('/stored', authMiddlewares.requireAuth, storedRouter)
  app.use('/customer', customerRouter)
  app.use('/movie', movieRouter)
  app.use('/booking', authMiddlewares.requireAuth, bookingRouter)
  app.use('/auth', accountController)
  app.use('/', homeRouter)
}

module.exports = route
