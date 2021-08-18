const express = require('express');
const exphbs  = require('express-handlebars');
const routes = require('./routes')
const path = require('path');
const db = require('../src/config/db')
const methodOverride = require('method-override')
const port = 3000;
db.connect()
// demo
const app = express();
app.use(methodOverride('_method'))

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', '.hbs');

app.use(
    express.urlencoded({
        extended: true,
    }),
);
// For post py fetch, httpRequest,...
app.use(express.json());

routes(app)

app.get('/', function(req, res) {
    res.render('home')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })
  
