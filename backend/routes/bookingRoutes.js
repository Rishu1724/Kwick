const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  extendBooking,
  returnEquipment
} = require('../controllers/bookingController');

const router = express.Router();

// All routes are protected
router.route('/')
  .post(protect, createBooking)
  .get(protect, getUserBookings);

router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, updateBooking);

router.route('/:id/cancel')
  .post(protect, cancelBooking);

router.route('/:id/extend')
  .post(protect, extendBooking);

router.route('/:id/return')
  .post(protect, returnEquipment);

module.exports = router;