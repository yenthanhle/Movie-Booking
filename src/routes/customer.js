const customerController = require('../app/controllers/CustomerController')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/uploads/')
  },
  //   filename: function (req, file, cb) {
  //     const uniqueSuffix = new Date().toISOString()
  //     cb(null, uniqueSuffix + '-' + file.originalname)
  //   },
})
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter })
router.put('/account/:_id/edit', customerController.putEditAccount)
router.post(
  '/avatar/:id/update',
  upload.single('avatar'),
  customerController.postUpdateAvatar,
)
router.get('/orders/:_id', customerController.getInvoice)
router.get('/orders', customerController.getOrders)
router.get('/account', customerController.getAccount)
module.exports = router
