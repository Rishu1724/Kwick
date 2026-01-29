const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createPaymentIntent,
  confirmPayment,
  processRefund,
  getUserPaymentHistory,
  getPaymentById,
  handlePaymentWebhook
} = require('../controllers/paymentController');

const router = express.Router();

// Routes that require authentication
router.route('/create-intent')
  .post(protect, createPaymentIntent);

router.route('/confirm')
  .post(protect, confirmPayment);

router.route('/history')
  .get(protect, getUserPaymentHistory);

router.route('/:id')
  .get(protect, getPaymentById);

router.route('/:id/refund')
  .post(protect, processRefund);

// Public webhook endpoint (should have proper verification)
router.route('/webhook')
  .post(handlePaymentWebhook);

module.exports = router;