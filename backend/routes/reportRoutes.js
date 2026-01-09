const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createReport,
  getReports,
  updateReportStatus,
  deleteReport
} = require('../controllers/reportController');

// All routes are protected
router.use(protect);

// Report routes
router.route('/')
  .post(createReport)
  .get(getReports);

router.route('/:id')
  .put(updateReportStatus)
  .delete(deleteReport);

module.exports = router;