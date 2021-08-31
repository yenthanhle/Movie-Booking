const User = require('../models/user')
const Bill = require('../models/bill')
const { mongooseToObject } = require('../util/mongoose')
class CustomersController {
  // [GET] customer/infor
  getAccount(req, res, next) {
    User.findOne({ _id: req.session.user._id })
      .then((user) => {
        console.log(user)
        res.render('customer/infor', {
          user: mongooseToObject(user),
          pageTitle: 'Show Account Infor',
          path: '/customer/account',
          // editing: editMode,
          isAuthenticated: req.session.isLoggedIn,
        })
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [PUT] customer/account/:id/edit
  putEditAccount(req, res, next) {
    User.updateOne({ _id: req.params._id }, req.body)
      .then(() => res.redirect('/customer/account/:id/edit'))
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [GET] customer/bill
  getBillList(req, res, next) {
    Bill.findOne({ user_id: req.signedCookies.user_id })
      .then((bill) =>
        res.render('customer/bill', {
          bill: mongooseToObject(bill),
          pageTitle: 'Show Bill Infor',
          path: '/customer/bill',
          // editing: editMode,
          isAuthenticated: req.session.isLoggedIn,
        }),
      )
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
}

module.exports = new CustomersController()
