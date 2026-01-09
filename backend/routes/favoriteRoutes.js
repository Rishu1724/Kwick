const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require('../controllers/favoriteController');

const router = express.Router();

router.route('/')
  .post(protect, addFavorite)
  .get(protect, getFavorites);

router.route('/:productId')
  .delete(protect, removeFavorite);

module.exports = router;