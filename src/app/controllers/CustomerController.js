const User = require('../models/user')
const { mongooseToObject } = require('../util/mongoose')
class CustomersController {
  index(req, res, next) {
    User.findOne({ _id: req.signedCookies.user_id })
      .then((user) => {
        res.render('customer/commonInfor', { user: mongooseToObject(user) })
      })
      .catch(next)
  }

  edit(req, res) {
    res.render('customer/detailInfor')
  }
}

module.exports = new CustomersController()
