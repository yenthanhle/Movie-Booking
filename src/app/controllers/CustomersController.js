const User = require('../models/user')
class CustomersController {
  index(req, res) {
    res.render('customers/commonInfor')
  }

  edit(req, res) {
    res.render('customers/detailInfor')
  }
  login(req, res) {
    res.render('customers/login')
  }
  register(req, res) {
    res.render('customers/register')
  }
  createAccount(req, res) {
    const formData = req.body
    const user = new User(formData)
    console.log(user)
    user.save()
    res.redirect('/movies')
  }
  loginAccount(req, res) {
    User.findOne({ user_name: req.body.user_name }, function (err, user) {
      console.log(user)
      if (user) res.redirect('/movies')
      else
        res.render('customers/login', {
          respond: {
            input: req.body,
            error: 'Username or password is wrong!!!',
          },
        })
    })
  }
}

module.exports = new CustomersController()
