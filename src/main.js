const express = require('express')
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const routes = require('./routes')
const path = require('path')
const db = require('../src/config/db')
const methodOverride = require('method-override')
const middleware = require('./app/middlewares/AuthMiddleware')
const port = 3000
const app = express()
app.use(methodOverride('_method'))
app.use(cookieParser('YTmovie'))

app.use(express.json())
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
  .then((result) => {
    const server = app.listen(port)
    const io = require('socket.io')(server)
    io.on('connection', (socket) => console.log('Connected!!!'))
  })
  .catch((err) => console.log(err))
