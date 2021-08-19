const User = require('../models/user')
const { mongooseToObject } = require('../util/mongoose')

function requireAuth(req, res, next) {
  if (!req.signedCookies.user_id) {
    res.redirect('/account')
    return
  }
  User.findOne({ _id: req.signedCookies.user_id }, function (err, user) {
    if (!user) {
      res.render('login/login', {
        respond: {
          input: req.body,
          error: 'Username or password is wrong!!!',
        },
      })
      return
    }
    next()
  })
}

// Show username in header if logged in
function showUserName(req, res, next) {
  if (!req.signedCookies.user_id) {
    next()
  } else {
    User.findOne({ _id: req.signedCookies.user_id }, function (err, user) {
      if (!user) return
      // save user to load user name
      else {
        res.locals.user = mongooseToObject(user)
        next()
      }
    })
  }
}
module.exports.requireAuth = requireAuth
module.exports.showUserName = showUserName
