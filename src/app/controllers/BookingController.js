const Timeline = require('../models/timeline')
const Bill = require('../models/bill')
const {
  multiMongooseToObject,
  mongooseToObject,
  getTheaterName,
} = require('../util/mongoose')
const timeline = require('../models/timeline')
class BookingController {
  index(req, res) {
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
    // console.log(weekList)
    Timeline.find(
      {
        movie_id: req.params._id,
        time: { $gte: today, $lte: weekList[weekList.length - 1] },
      },
      function (err, timelines) {
        // var theater_id = multiMongooseToObject(timelines).map((timeline) =>
        //   timeline.theater_id.toString(),
        // )
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
        // console.log('tmp: ', tmp)
        timelineInWeek.forEach((timelineInDay) => {
          var theater_id = timelineInDay.map((timeline) => timeline.theater_id)
          theater_id = [...new Set(theater_id)]
          // console.log('theater id:', theater_id)

          var timelineInEachTheater = []

          // init
          for (let i = 0; i < theater_id.length; i++) {
            timelineInEachTheater.push({
              theater_id: theater_id[i],
              theater_name: 'temp',
              listTimeline: [],
            })
            // console.log(timelineInEachTheater)
            // set theater name
            getTheaterName(theater_id[i], (tname) => {
              // console.log('name', tname)
              timelineInEachTheater[i].theater_name = tname.name
            })
          }
          // add id of timeline of every theater
          timelineInDay.forEach((timelines, index) => {
            for (let j in theater_id) {
              // console.log(timelines.theater_id, theater_id[j])
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
        // setTimeout(function () {
        //   console.log(result[0][0].listTimeline)
        // }, 4000)
        res.render('booking/timelineList', {
          timelines: result,
        })
      },
    )
  }

  detail(req, res, next) {
    res.render('booking/bookingDetail', { id: req.params._id })
  }
  showPayment(req, res, next) {
    console.log('Body: ', req.body)

    const formData = req.body
    formData.user_id = 'user001'
    formData.seat_name = formData.seat_name.trim()
    formData.time_created = new Date().toLocaleDateString()
    // console.log(formData.time_created)
    // console.log()
    console.log(formData)
    res.render('booking/payment', { infor: formData })
  }
  storePayment(req, res, next) {
    const formData = req.body
    formData.time_created = new Date()
    const bill = new Bill(formData)
    // formData.time = new Date(formData.date + ' ' + formData.time)
    // const timeline = new Bill(formData)
    bill.save()
    // console.log(bill)
    res.redirect('/movies')
  }
}

module.exports = new BookingController()
