const User = require('../models/user')
const session = require('express-session')

const { mongooseToObject } = require('../util/mongoose')

function requireAuth(req, res, next) {
  if (!req.session.isLoggedIn) {
    res.redirect('/auth/login')
    return
  }
  User.findOne({ _id: req.session.user._id }, function (err, user) {
    if (!user) {
      return res.render('auth/login', {
        respond: {
          input: req.body,
          error: 'Username or password is wrong!!!',
        },
      })
    }
    if (!user.isActive) {
      res.render('auth/login', {
        respond: {
          input: req.body,
          error: 'Please verify your email to start using YT movie booking!!!',
        },
      })
    }
    next()
  })
}

// Show username in header if logged in
function showUserName(req, res, next) {
  if (!req.session.isLoggedIn) {
    next()
  } else {
    User.findOne({ _id: req.session.user._id }, function (err, user) {
      if (!user) return
      // save user to load user name
      else {
        res.locals.userInfor = mongooseToObject(user)
        next()
      }
    })
  }
}
module.exports.requireAuth = requireAuth
module.exports.showUserName = showUserName
