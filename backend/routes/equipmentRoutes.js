const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentByCategory,
  getEquipmentAvailability,
  uploadEquipmentImages,
  getMyEquipment
} = require('../controllers/equipmentController');
const { upload, uploadMultipleImages } = require('../middlewares/upload');

const router = express.Router();

router.route('/')
  .post(protect, upload.array('images', 5), uploadMultipleImages, createEquipment)
  .get(getEquipment);

router.route('/my')
  .get(protect, getMyEquipment);

router.route('/featured')
  .get((req, res, next) => {
    req.query.featured = 'true';
    next();
  }, getEquipment);

router.route('/:id')
  .get(getEquipmentById)
  .put(protect, upload.array('images', 5), uploadMultipleImages, updateEquipment)
  .delete(protect, deleteEquipment);

router.route('/:id/availability')
  .get(getEquipmentAvailability);

router.route('/:id/images')
  .post(protect, upload.array('images', 5), uploadMultipleImages, uploadEquipmentImages);

router.route('/category/:category')
  .get(getEquipmentByCategory);

module.exports = router;