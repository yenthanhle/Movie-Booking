const User = require('../models/user')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport(
  'smtps://lethiyenthanh99%40gmail.com:B@utroico1001*@smtp.gmail.com',
)
const { validationResult } = require('express-validator')
class AuthController {
  getLogin(req, res) {
    // let message = req.flash('error')
    // if (message.length > 0) {
    //   message = message[0]
    // } else {
    //   message = null
    // }

    res.render('auth/login', {
      path: 'auth/',
      pageTitle: 'Login',
      // errorMessage: message,
      isLogging: true,
      validationErrors: [],
    })
  }

  postLogin(req, res, next) {
    // const errors = validationResult(req);
    const user_name = req.body.user_name
    const password = req.body.password
    User.findOne({
      $or: [{ user_name: user_name }, { email: user_name }],
    }).then((user) => {
      if (!user)
        return res.render('auth/login', {
          oldInput: req.body,
          error: 'User is not exist!!!',
          validationErrors: [],
        })
      if (!user.isActive)
        return res.render('auth/login', {
          oldInput: req.body,
          error: 'Please verify your email to start using YT movie booking!!!',
          validationErrors: [],
        })
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch)
            return res.render('auth/login', {
              oldInput: req.body,
              error: 'User name or password is incorrect!!!',
              validationErrors: [],
            })
          req.session.user = user
          req.session.isLoggedIn = true
          req.session.cookie.maxAge = 7200000
          req.session.save((err) => {
            // console.log(err)
            res.redirect('/')
          })
        })
        .catch((err) => {
          const error = new Error(err)
          error.httpStatusCode = 500
          return next(error)
        })
    })
  }
  getSignup(req, res) {
    res.render('auth/signup', {
      path: 'auth/',
      pageTitle: 'Signup',
      // errorMessage: message,
      isLogging: true,
      validationErrors: [],
    })
  }
  postSignup(req, res) {
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email: email }).then((user) => {
      if (user) {
        return res.render('auth/signup', {
          path: 'auth/signup',
          pageTitle: 'Signup',
          // errorMessage: message,
          oldInput: req.body,
          error: 'Email already existed!!!',
          isLoggedIn: req.session.isLoggedIn,
          validationErrors: [],
        })
      }
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          console.log(err)
          return redirect('/auth/reset')
        }
        const token = buffer.toString('hex')
        return bcrypt.hash(password, 12).then((hashPassword) => {
          const user = new User({
            user_name: req.body.user_name,
            email: email,
            password: hashPassword,
            gender: req.body.gender,
            date_of_birth: req.body.date_of_birth,
            phone_number: req.body.phone_number,
            address: req.body.address,
            verifyToken: token,
            isActive: false,
          })
          user
            .save()
            .then(() => {
              const mailOptions = {
                from: '"YT movie booking" <foo@example.com>', // sender address
                to: email, // list of receivers
                subject: 'Verify your email to start using YT movie booking', // Subject line
                html: `
          <p>You requested to create a new account</p>
          <p>Click this <a href="http://localhost:3000/auth/verify/${token}">link</a> to verify your email.</p>`,
              }
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.log('Error: ', error)
                console.log('Respond: ', info.response)
              })

              return res.render('auth/signup', {
                path: 'auth/',
                pageTitle: 'Signup',
                respond: 'Click attached link in email to verify your email!!!',
                // errorMessage: message,
                isLogging: true,
                validationErrors: [],
              })
            })
            .catch((err) => {
              const error = new Error(err)
              error.httpStatusCode = 500
              return next(error)
            })
        })
        // return user.save().then(() => res.redirect('/auth/login'))
      })
    })
  }
  getVerifyAccount(req, res, next) {
    const token = req.params.token
    User.findOne({ verifyToken: token })
      .then((user) => {
        if (!user) res.send('<h2>Page not found!!!</h2>')
        user.isActive = true
        user.save().then(() => res.redirect('/auth/login'))
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  getReset(req, res, next) {
    res.render('auth/reset', {
      path: 'auth/reset',
      pageTitle: 'Reset password',
      // errorMessage: message,
      isLoggedIn: req.session.isLoggedIn,
      validationErrors: [],
    })
  }

  postReset(req, res, next) {
    const email = req.body.email
    User.findOne({ email: email })
      .then((user) => {
        if (!user)
          return res.render('auth/reset', {
            path: 'auth/reset',
            pageTitle: 'Reset password',
            // errorMessage: message,
            oldInput: req.body,
            error: "Email hasn't been register yet!!!",
            isLoggedIn: req.session.isLoggedIn,
            validationErrors: [],
          })
        crypto.randomBytes(32, (err, buffer) => {
          if (err) {
            console.log(err)
            return redirect('/auth/reset')
          }
          const token = buffer.toString('hex')
          const mailOptions = {
            from: '"YT movie booking" <foo@example.com>', // sender address
            to: email, // list of receivers
            subject: 'Reset password', // Subject line
            html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/auth/reset/${token}">link</a> to set a new password.</p>
        <p>This link will be expired in 10 minutes.</p>`,
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log('Error: ', error)
            console.log('Respond: ', info.response)
          })
          user.resetToken = token
          user.resetTokenExpiration = Date.now() + 600000
          return user.save()
        })
      })
      .then(() => {
        return res.render('auth/reset', {
          path: 'auth/reset',
          pageTitle: 'Reset password',
          // errorMessage: message,
          oldInput: req.body,
          error: '',
          respond:
            'Check your email and click attached link in mail to reset password!',
          isLoggedIn: req.session.isLoggedIn,
          validationErrors: [],
        })
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  getNewPassword(req, res, next) {
    const token = req.params.token
    User.findOne({
      resetToken: token,
      // resetTokenExpiration: { $lte: new Date() },
    })
      .then((user) => {
        if (!user) return res.send('<h2>Page not found!!!</h2>')
        return user
      })
      .then((user) => {
        if (user.resetTokenExpiration <= new Date())
          return res.send('<h2>Reset password time has been expired!!!</h2>')
        return res.render('auth/new-password', {
          path: 'auth/reset/:token',
          pageTitle: 'New password',
          // errorMessage: message,
          token: token,
          oldInput: req.body,
          error: '',
          isLoggedIn: req.session.isLoggedIn,
          validationErrors: [],
        })
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  // [POST] /auth/reset/:token
  postNewPassword(req, res, next) {
    const token = req.params.token
    // console.log(token)
    const oldPassword = req.body.old_password
    const newPassword = req.body.password
    User.findOne({ resetToken: token })
      .then((user) => {
        if (!user)
          return res.send('<h2>Reset password link is incorrect!!!</h2>')
        bcrypt.compare(oldPassword, user.password).then((result) => {
          if (!result)
            return res.render('auth/new-password', {
              token: token,
              oldInput: req.body,
              error: 'Old password is incorrect!!!',
            })
          bcrypt.compare(newPassword, user.password).then((isMatch) => {
            if (isMatch)
              return res.render('auth/new-password', {
                token: token,
                oldInput: req.body,
                error: 'New password must be different form old password!!!',
              })
            return bcrypt.hash(newPassword, 12).then((hashPassword) => {
              const user_new = user
              user_new.password = hashPassword
              return user_new.save().then(() => res.redirect('/auth/login'))
            })
          })
        })
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  }
  postLogout(req, res) {
    req.session.destroy((err) => {
      console.log(err)
      res.redirect('/auth/login')
    })
  }
}

module.exports = new AuthController()
