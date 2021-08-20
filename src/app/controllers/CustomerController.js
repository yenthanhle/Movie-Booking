const User = require('../models/user')
const { mongooseToObject } = require('../util/mongoose')
class CustomersController {
  index(req, res, next) {
    User.findOne({ _id: req.signedCookies.user_id })
      .then((user) => {
        res.render('customer/infor', { user: mongooseToObject(user) })
      })
      .catch(next)
  }

  updateAccount(req, res, next) {
    console.log(req.params._id)
    console.log(req.body)
    User.updateOne({ _id: req.params._id }, req.body)
      .then(() => res.redirect('/customer/account'))
      .catch(next)
  }
  showBillList(req, res, next) {
    res.render('customer/bill')
  }
}

module.exports = new CustomersController()
