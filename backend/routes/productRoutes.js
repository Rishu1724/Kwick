const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require('../controllers/productController');
const { upload } = require('../middlewares/upload');

const router = express.Router();

router.route('/')
  .post(protect, upload.array('images', 5), createProduct)
  .get(getProducts);

router.route('/featured')
  .get((req, res, next) => {
    req.query.featured = 'true';
    next();
  }, getProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, upload.array('images', 5), updateProduct)
  .delete(protect, deleteProduct);

router.route('/category/:category')
  .get(getProductsByCategory);

module.exports = router;