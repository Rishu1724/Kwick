const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { body, validationResult } = require('express-validator');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
const getEquipment = asyncHandler(async (req, res) => {
  // Build query object for filtering
  const queryObj = { ...req.query };

  // Keyword search (title/description)
  const keyword = (req.query.keyword || req.query.title || '').trim();
  if (keyword) {
    delete queryObj.keyword;
    delete queryObj.title;
    queryObj.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ];
  }

  // Location search (city/state/pincode)
  const location = (req.query.location || '').trim();
  if (location) {
    delete queryObj.location;
    queryObj.$and = queryObj.$and || [];
    queryObj.$and.push({
      $or: [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.pincode': { $regex: location, $options: 'i' } }
      ]
    });
  }

  // Fields to exclude
  const excludeFields = ['page', 'sort', 'limit', 'fields', 'featured'];
  excludeFields.forEach(field => delete queryObj[field]);

  // Advanced filtering for price, ratings, etc.
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  let query = Equipment.find(JSON.parse(queryStr)).populate('ownerId', 'name email');

  // Select fields
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Equipment.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  if (req.query.featured === 'true') {
    query = query.where('isFeatured').equals(true);
  }

  const equipment = await query;

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: total,
    pagination,
    data: equipment
  });
});

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentById = asyncHandler(async (req, res) => {
  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid equipment ID format' 
    });
  }

  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('ownerId', 'name email phone location averageRating');

    if (!equipment) {
      return res.status(404).json({ 
        success: false,
        message: 'Equipment not found' 
      });
    }

    // Get reviews for this equipment separately
    const Review = require('../models/Review');
    const reviews = await Review.find({ productId: req.params.id })
      .populate('buyerId', 'name')
      .populate('sellerId', 'name')
      .sort({ createdAt: -1 });

    // Increment view count safely
    equipment.views = (equipment.views || 0) + 1;
    await equipment.save({ validateBeforeSave: false }); // Skip validation to avoid conflicts

    // Combine equipment and reviews in response
    const responseData = {
      ...equipment.toObject(),
      reviews: reviews
    };

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error in getEquipmentById:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error occurred while fetching equipment details',
      error: error.message 
    });
  }
});

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private
const createEquipment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Add owner to equipment object
  req.body.ownerId = req.user._id;

  // Create equipment
  const equipment = await Equipment.create(req.body);

  res.status(201).json({
    success: true,
    data: equipment
  });
});

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private
const updateEquipment = asyncHandler(async (req, res) => {
  let equipment = await Equipment.findById(req.params.id);

  if (!equipment) {
    return res.status(404).json({ message: 'Equipment not found' });
  }

  // Check if user owns the equipment
  if (equipment.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(401).json({ message: 'Not authorized to update this equipment' });
  }

  equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: equipment
  });
});

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private
const deleteEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);

  if (!equipment) {
    return res.status(404).json({ message: 'Equipment not found' });
  }

  // Check if user owns the equipment
  if (equipment.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(401).json({ message: 'Not authorized to delete this equipment' });
  }

  // Check if equipment has active bookings
  const activeBookings = await Booking.find({
    equipmentId: req.params.id,
    status: { $in: ['active', 'confirmed', 'pending'] }
  });

  if (activeBookings.length > 0) {
    return res.status(400).json({ message: 'Cannot delete equipment with active bookings' });
  }

  await equipment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get equipment by category
// @route   GET /api/equipment/category/:category
// @access  Public
const getEquipmentByCategory = asyncHandler(async (req, res) => {
  const equipment = await Equipment.find({ category: req.params.category })
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: equipment.length,
    data: equipment
  });
});

// @desc    Get equipment availability
// @route   GET /api/equipment/:id/availability
// @access  Public
const getEquipmentAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const equipment = await Equipment.findById(req.params.id);
  if (!equipment) {
    return res.status(404).json({ message: 'Equipment not found' });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Please provide both start and end dates' });
  }

  // Check for overlapping bookings
  const overlappingBookings = await Booking.find({
    equipmentId: req.params.id,
    status: { $in: ['pending', 'confirmed', 'active'] },
    $or: [
      { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
      { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
      { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
    ]
  });

  const isAvailable = overlappingBookings.length === 0;

  res.status(200).json({
    success: true,
    data: {
      equipmentId: equipment._id,
      isAvailable,
      totalQuantity: equipment.totalQuantity,
      availableQuantity: isAvailable ? equipment.availableQuantity : 0,
      overlappingBookings: overlappingBookings.length
    }
  });
});

// @desc    Upload equipment images
// @route   POST /api/equipment/:id/images
// @access  Private
const uploadEquipmentImages = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);

  if (!equipment) {
    return res.status(404).json({ message: 'Equipment not found' });
  }

  // Check if user owns the equipment
  if (equipment.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(401).json({ message: 'Not authorized to upload images for this equipment' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  // Add image URLs to equipment
  const imageUrls = req.files.map(file => file.path || file.location); // Using Cloudinary path
  equipment.images = [...equipment.images, ...imageUrls];
  await equipment.save();

  res.status(200).json({
    success: true,
    data: equipment
  });
});

// @desc    Get user's equipment
// @route   GET /api/equipment/my
// @access  Private
const getMyEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.find({ ownerId: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: equipment.length,
    data: equipment
  });
});

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentByCategory,
  getEquipmentAvailability,
  uploadEquipmentImages,
  getMyEquipment
};