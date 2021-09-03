const express = require('express')
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const routes = require('./routes')
const path = require('path')
const db = require('../src/config/db')
const methodOverride = require('method-override')
const middleware = require('./app/middlewares/AuthMiddleware')
// const flash = require('connect-flash')
const session = require('express-session')
const MONGODB_URI = 'mongodb://localhost:27017/YT_Movies'
const MongoDBStore = require('connect-mongodb-session')(session)
const store = MongoDBStore({ uri: MONGODB_URI, collection: 'sessions' })
const port = 3000
const app = express()
// var server = require('http').Server(app)
// var io = require('socket.io')(server)
// server.listen(port)
app.use(methodOverride('_method'))
app.use(cookieParser('YTmovie'))

app.use(express.json())
app.use(
  session({
    secret: 'my secret key',
    save: false,
    saveUninitialized: false,
    store: store,
  }),
)
app.use(middleware.showUserName)
app.use(express.static(path.join(__dirname, 'public')))
// For post py fetch, httpRequest,...
app.use(
  express.urlencoded({
    extended: true,
  }),
)
app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', '.hbs')

routes(app)
app.get('/', function (req, res) {
  res.render('home')
})

db.connect()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`)
    })
    const io = require('./socket').init(server)
    io.on('connection', (socket) => console.log(socket.id + ' connected!!!'))
  })
  .catch((error) => console.log(error))
