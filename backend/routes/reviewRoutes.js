const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createReview,
  getEquipmentReviews,
  getSellerReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Public routes
router.route('/equipment/:productId')
  .get(getEquipmentReviews);

router.route('/seller/:sellerId')
  .get(getSellerReviews);

// Protected routes
router.use(protect);

router.route('/')
  .post(createReview);

router.route('/:id')
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;