const Timeline = require('../models/timeline')
const Bill = require('../models/bill')
const { multiMongooseToObject, getTheaterName } = require('../util/mongoose')
const timeline = require('../models/timeline')
class BookingController {
  index(req, res, next) {
    res.render('booking/bookingDetail', { id: req.params._id })
  }
  // [GET] booking/:_id
  showTimeline(req, res) {
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
    Timeline.find(
      {
        movie_id: req.params._id,
        time: { $gte: today, $lte: weekList[weekList.length - 1] },
      },
      function (err, timelines) {
        // add timeline according each days
        var timelineList = multiMongooseToObject(timelines)
        const timelineInWeek = new Array(7)
        timelineList.forEach((timeline) => {
          timeline.theater_id = timeline.theater_id.toString()
          const dayIndex = timeline.time.getDate() - weekList[0].getDate()
          if (timelineInWeek[dayIndex]) timelineInWeek[dayIndex].push(timeline)
          else timelineInWeek[dayIndex] = [timeline]
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
        })
      },
    )
  }
  // [GET] booking/:_id/detail

  //  [POST] booking/payment
  showPayment(req, res, next) {
    const formData = req.body
    formData.user_id = req.cookies.user_id
    formData.seat_name = formData.seat_name.trim()
    formData.time_created = new Date().toLocaleDateString()
    console.log(formData)
    res.render('booking/payment', { infor: formData })
  }

  // [POST] booking/payment/confirm
  storePayment(req, res, next) {
    const formData = req.body
    formData.time_created = new Date()
    const bill = new Bill(formData)
    bill.save()
    res.redirect('/')
  }
}

module.exports = new BookingController()
