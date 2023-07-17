const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post(
  '/checkout-session',
  authController.protect,
  bookingController.getCheckoutSession
);

router.get('/getItems/:id', authController.protect, bookingController.getPurchasedItems);

module.exports = router;