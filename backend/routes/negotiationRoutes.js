const express = require('express');
const { protect } = require('../middlewares/auth');
const { submitNegotiation } = require('../controllers/negotiationController');

const router = express.Router();

// @route   POST /api/negotiations
// Submit a price negotiation for equipment
router.route('/')
  .post(protect, submitNegotiation);

module.exports = router;