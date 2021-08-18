const User = require('../models/user')
class LoginController {
  index(req, res) {
    res.render('login')
  }
  createAccount(req, res) {
    const formData = req.body
    const user = new User(formData)
    console.log(user)
    user.save()
    res.redirect('/movies')
  }
}
module.exports = new LoginController()
