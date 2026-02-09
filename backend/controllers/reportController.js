const Report = require('../models/Report');
const Equipment = require('../models/Equipment');
const asyncHandler = require('express-async-handler');

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
  const { productId, reason, description } = req.body;

  // Check if equipment exists
  const equipment = await Equipment.findById(productId);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipment not found');
  }

  // Check if user already reported this equipment
  const alreadyReported = await Report.findOne({
    reporterId: req.user._id,
    productId
  });

  if (alreadyReported) {
    res.status(400);
    throw new Error('You have already reported this equipment');
  }

  const report = new Report({
    productId,
    reporterId: req.user._id,
    reason,
    description
  });

  const createdReport = await report.save();

  res.status(201).json(createdReport);
});

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized as admin');
  }

  const reports = await Report.find()
    .populate('productId', 'title dailyRate images')
    .populate('reporterId', 'name email')
    .sort({ createdAt: -1 });

  res.json(reports);
});

// @desc    Update report status (Admin only)
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized as admin');
  }

  const { status } = req.body;

  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  report.status = status || report.status;

  const updatedReport = await report.save();

  res.json(updatedReport);
});

// @desc    Delete report (Admin only)
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized as admin');
  }

  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  await report.remove();

  res.json({ message: 'Report removed' });
});

module.exports = {
  createReport,
  getReports,
  updateReportStatus,
  deleteReport
};