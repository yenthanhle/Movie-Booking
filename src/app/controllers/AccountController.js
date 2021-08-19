const User = require('../models/user')
class LoginController {
  index(req, res) {
    res.render('login/login')
  }
  // createAccount(req, res) {
  //   const formData = req.body
  //   const user = new User(formData)
  //   console.log(user)
  //   user.save()
  //   res.redirect('/movies')
  // }
  login(req, res) {
    User.findOne(
      { user_name: req.body.user_name, password: req.body.password },
      function (err, user) {
        if (user) {
          // console.log(user)
          res.locals.user_name = user.user_name
          res.cookie('user_id', user._id.toString(), { signed: true })
          res.redirect('/movie')
        } else {
          res.render('login/login', {
            respond: {
              input: req.body,
              error: 'Username or password is wrong!!!',
            },
          })
        }
      },
    )
  }
  register(req, res) {
    res.render('login/register')
  }
  createAccount(req, res) {
    const formData = req.body
    const user = new User(formData)
    console.log(user)
    user.save()
    res.redirect('/movie')
  }
  signout(req, res) {
    res.clearCookie('user_id')
    res.redirect('/account')
  }
}

module.exports = new LoginController()
