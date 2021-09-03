const User = require('../models/user')
const Order = require('../models/order')
const Movie = require('../models/movie')
const Theater = require('../models/theater')
const Timeline = require('../models/timeline')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
// const multer = require('multer')
// const upload = multer({ dest: './public/uploads/' })
const { multiMongooseToObject, getTimelineInfor } = require('../util/mongoose')
const { encode } = require('punycode')
class CustomersController {
  // [GET] customer/infor
  getAccount(req, res, next) {
    User.findOne({ _id: req.session.user._id })
      .then((user) => {
        console.log(user)
        res.render('customer/account', {
          user: req.session.user,
          // user: mongooseToObject(user),
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
  getOrders(req, res, next) {
    const userId = req.session.user._id.toString()
    Order.find({ user_id: userId }, (err, orders) => {
      return res.render('customer/orders', {
        user: req.session.user,
        orders: multiMongooseToObject(orders),
        // user: mongooseToObject(user),
        pageTitle: 'Show Order Infor',
        path: '/customer/orders',
        // editing: editMode,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
  }
  getInvoice(req, res, next) {
    const orderId = req.params._id
    Order.findOne({ _id: orderId, user_id: req.session.user._id })
      .then((order) => {
        if (!order) {
          return next(new Error('No order found!!!'))
        }
        if (order.user_id.toString() != req.session.user._id) {
          return next(new Error('Unauthorized!!!'))
        }
        Timeline.findById(order.timeline_id.toString())
          .then((timeline) => {
            getTimelineInfor(timeline, (result) => {
              const invoiceName = `invoice-${orderId}.pdf`
              const invoicePath = path.join('src/data', 'invoices', invoiceName)
              const pdfDoc = new PDFDocument()
              res.setHeader('Content-Type', 'application/pdf')
              res.setHeader(
                'Content-Disposition',
                `inline; filename="${invoiceName}"`,
              )
              pdfDoc.pipe(fs.createWriteStream(invoicePath))
              pdfDoc.pipe(res)
              pdfDoc.font('Times-Roman').fillColor('red').fontSize(14).text(`
              Order Id: ${order._id.toString()}
              Movie name: ${result.movie_name}
              Theater name: ${result.theater_name}
              Date: ${result.date}
              Time: ${result.time}
              Room: ${result.room}
              Seat name: ${order.seat_name}
              Payment: ${order.payment}
              `)
              pdfDoc.rect(pdfDoc.x - 10, pdfDoc.x - 10, 480, 600).stroke()
              pdfDoc.end()
            })
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => next(err))

    // res.render('customer/bill', {
    //   user: req.session.user,
    //   // user: mongooseToObject(user),
    //   pageTitle: 'Show Order Infor',
    //   path: '/customer/bill',
    //   // editing: editMode,
    //   isAuthenticated: req.session.isLoggedIn,
    // })
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
  // getBillList(req, res, next) {

  //   Order.findOne({ user_id: req.session.user.user_id })
  //     .then((bill) =>
  //       res.render('customer/bill', {
  //         bill: mongooseToObject(bill),
  //         pageTitle: 'Show Order Infor',
  //         path: '/customer/bill',
  //         // editing: editMode,
  //         isAuthenticated: req.session.isLoggedIn,
  //       }),
  //     )
  //     .catch((err) => {
  //       const error = new Error(err)
  //       error.httpStatusCode = 500
  //       return next(error)
  //     })
  // }
  postUpdateAvatar(req, res, next) {
    // const user = new User(req.session.user)
    // user.avatar = req.file.path.replace('./src/public/', '')
    const filter = { _id: req.session.user._id }
    const update = {
      avatar: '/' + req.file.path.split('\\').splice(2).join('/'),
    }
    User.findOneAndUpdate(filter, update).then((user) => {
      req.session.user = user
      res.redirect('/customer/account')
    })
  }
}

module.exports = new CustomersController()
