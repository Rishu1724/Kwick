const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;