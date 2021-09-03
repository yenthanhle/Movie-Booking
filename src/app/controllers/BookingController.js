const Timeline = require('../models/timeline')
const Order = require('../models/order')
const openSocket = require('socket.io-client')
const { multiMongooseToObject, getTheaterName } = require('../util/mongoose')
class BookingController {
  // [GET] booking/:_id/detail'
  getBookingDetail(req, res, next) {
    openSocket('http://localhost:3000')
    res.render('booking/bookingDetail', {
      id: req.params._id,
      pageTitle: 'Show Booking Detail',
      path: '/booking/:_id/detail',
      // editing: editMode,
      isAuthenticated: req.session.isLoggedIn,
    })
  }
  // [GET] booking/:_id
  getTimeline(req, res, next) {
    const now = new Date()
    var today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
    )
    // get 6 next days
    var weekList = [today]
    for (let i = 1; i < 7; i++) {
      const nextDay = new Date(new Date().setDate(new Date().getDate() + i))
      // to the end of last day in weekList
      if (i == 6) nextDay.setHours(30, 59)
      else nextDay.setHours(7, 0, 0, 0)
      weekList.push(nextDay)
    }
    // find timeline in a weeek
    Timeline.find({
      movie_id: req.params._id,
      time: { $gte: today, $lte: weekList[weekList.length - 1] },
    })
      .then((timelines) => {
        // add timeline in week to list
        var timelineList = multiMongooseToObject(timelines)
        const timelineInWeek = new Array(7)

        timelineList.forEach((timeline) => {
          timeline.theater_id = timeline.theater_id.toString()
          const dayIndex = timeline.time.getDate() - weekList[0].getDate()
          if (!timelineInWeek[dayIndex]) timelineInWeek[dayIndex] = [timeline]
          else timelineInWeek[dayIndex].push(timeline)
        })

        const result = []
        timelineInWeek.forEach((timelineInDay) => {
          var theater_id = timelineInDay.map((timeline) => timeline.theater_id)
          theater_id = [...new Set(theater_id)]
          var timelineInEachTheater = []
          // init
          for (let i = 0; i < theater_id.length; i++) {
            timelineInEachTheater.push({
              theater_id: theater_id[i],
              theater_name: 'temp',
              listTimeline: [],
            })
            // set theater name
            getTheaterName(theater_id[i], (tname) => {
              timelineInEachTheater[i].theater_name = tname.name
            })
          }
          // add id of timeline of every theater
          timelineInDay.forEach((timelines, index) => {
            for (let j in theater_id) {
              if (timelines.theater_id === theater_id[j]) {
                timelineInEachTheater[j].listTimeline.push({
                  _id: timelines._id,
                  time: timelines.time.toLocaleTimeString().slice(0, 5),
                })
              }
            }
          })
          result.push(timelineInEachTheater)
        })
        res.render('booking/timelineList', {
          timelines: result,
          pageTitle: 'Show Timeline List',
          path: '/booking/:id',
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

  //  [POST] booking/payment
  getPayment(req, res, next) {
    const formData = req.body
    console.log(formData)
    formData.user_id = req.session.user._id
    formData.seat_name = formData.seat_name.trim()
    formData.time_created = new Date().toLocaleDateString()

    // const bill = new Order(formData)
    // io.getIO().emit('booked', { seat: formData.seat_name })

    // const session = stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   mode: 'setup',
    //   success_url: 'http://localhost:3000/booking/success',
    //   cancel_url: 'http://localhost:3000/booking/cancel',
    // })

    res.render('booking/payment', {
      infor: formData,
      // sessionId: session.id,
      pageTitle: 'Show Payment',
      path: '/booking/payment',
      // editing: editMode,
      isAuthenticated: req.session.isLoggedIn,
    })
  }

  // [POST] booking/payment/confirm
  postPayment(req, res, next) {
    const formData = req.body
    formData.time_created = new Date()
    const bill = new Order(formData)
    bill
      .save()
      .then(() => res.redirect('/'))
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  //   showSuccess(req, res) {
  //     res.send('Success')
  //   }
  //   showCancel(req, res) {
  //     res.send('Cancel')
  //   }
}

module.exports = new BookingController()
