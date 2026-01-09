const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { upload } = require('../middlewares/upload');

const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, upload.single('avatar'), updateUserProfile);

module.exports = router;