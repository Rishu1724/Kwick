const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    equipmentId,
    startDate,
    endDate,
    bookingType,
    totalAmount,
    securityDeposit,
    cancellationPolicy,
    specialRequests,
    deliveryOption,
    deliveryAddress
  } = req.body;

  // Guard rails: prevent 500s on bad client payloads.
  if (!equipmentId || !mongoose.Types.ObjectId.isValid(equipmentId)) {
    return res.status(400).json({ message: 'Invalid equipmentId' });
  }
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'startDate and endDate are required' });
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: 'Invalid startDate or endDate' });
  }
  if (end < start) {
    return res.status(400).json({ message: 'endDate must be on or after startDate' });
  }
  if (totalAmount === undefined || totalAmount === null || Number.isNaN(Number(totalAmount))) {
    return res.status(400).json({ message: 'totalAmount is required' });
  }

  // Validate equipment exists and is available
  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    return res.status(404).json({ message: 'Equipment not found' });
  }

  if (equipment.status !== 'available') {
    return res.status(400).json({ message: 'Equipment is not available for booking' });
  }

  // Check for overlapping bookings
  const overlappingBooking = await Booking.findOne({
    equipmentId,
    status: { $in: ['pending', 'confirmed', 'active'] },
    $or: [
      { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
      { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
      { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
    ]
  });

  if (overlappingBooking) {
    return res.status(400).json({ message: 'Equipment is already booked for the selected dates' });
  }

  // Create booking
  const booking = await Booking.create({
    equipmentId,
    renterId: req.user._id,
    ownerId: equipment.ownerId,
    startDate: start,
    endDate: end,
    bookingType,
    totalAmount: Number(totalAmount),
    securityDeposit,
    cancellationPolicy,
    specialRequests,
    deliveryOption,
    deliveryAddress,
    status: 'pending' // Initially pending until payment is confirmed
  });

  // Update equipment status to 'rented'
  await Equipment.findByIdAndUpdate(equipmentId, { status: 'rented' });

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const { role } = req.query; // 'renter' or 'owner'

  let filter = {};
  
  if (role === 'owner') {
    filter.ownerId = req.user._id;
  } else {
    filter.renterId = req.user._id;
  }

  const bookings = await Booking.find(filter)
    .populate('equipmentId', 'title images category subCategory')
    .populate('renterId', 'name email')
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('equipmentId', 'title description images category subCategory brand model')
    .populate('renterId', 'name email phone')
    .populate('ownerId', 'name email phone')
    .populate('reviews', 'rating comment createdAt');

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user has permission to view this booking
  if (req.user.role !== 'admin' && 
      booking.renterId.toString() !== req.user._id.toString() && 
      booking.ownerId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to access this booking' });
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user has permission to update this booking
  if (req.user.role !== 'admin' && 
      booking.renterId.toString() !== req.user._id.toString() && 
      booking.ownerId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to update this booking' });
  }

  const previousStatus = booking.status;
  const nextStatus = req.body?.status;

  // Status lifecycle is owner-controlled.
  // Renters must not be able to self-confirm (or otherwise change status) via PUT.
  if (nextStatus && req.user.role !== 'admin') {
    const isOwner = booking.ownerId.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: 'Only the owner can update booking status' });
    }
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  // Keep equipment availability in sync when status changes.
  if (nextStatus && nextStatus !== previousStatus) {
    const makeAvailableStatuses = new Set(['cancelled', 'returned', 'completed']);
    const makeRentedStatuses = new Set(['pending', 'confirmed', 'active']);

    if (makeAvailableStatuses.has(nextStatus)) {
      await Equipment.findByIdAndUpdate(updatedBooking.equipmentId, { status: 'available' });
    } else if (makeRentedStatuses.has(nextStatus)) {
      await Equipment.findByIdAndUpdate(updatedBooking.equipmentId, { status: 'rented' });
    }
  }

  res.status(200).json({
    success: true,
    data: updatedBooking
  });
});

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user has permission to cancel this booking
  if (req.user.role !== 'admin' && 
      booking.renterId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to cancel this booking' });
  }

  // Check if booking can be cancelled based on status and cancellation policy
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    return res.status(400).json({ message: 'Cannot cancel booking at this stage' });
  }

  // Update booking status
  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'cancelled',
      cancellationReason: req.body.reason || 'User cancelled'
    },
    {
      new: true
    }
  ).populate('equipmentId');

  // Update equipment status back to 'available'
  await Equipment.findByIdAndUpdate(updatedBooking.equipmentId._id, { status: 'available' });

  res.status(200).json({
    success: true,
    data: updatedBooking,
    message: 'Booking cancelled successfully'
  });
});

// @desc    Extend booking
// @route   POST /api/bookings/:id/extend
// @access  Private
const extendBooking = asyncHandler(async (req, res) => {
  const { newEndDate, extensionReason } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user has permission to extend this booking
  if (req.user.role !== 'admin' && 
      booking.renterId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to extend this booking' });
  }

  // Check if booking can be extended
  if (booking.status !== 'active') {
    return res.status(400).json({ message: 'Cannot extend booking at this stage' });
  }

  // Check if new end date overlaps with another booking
  const overlappingBooking = await Booking.findOne({
    equipmentId: booking.equipmentId,
    _id: { $ne: booking._id },
    status: { $in: ['pending', 'confirmed', 'active'] },
    $or: [
      { startDate: { $lte: new Date(newEndDate) }, endDate: { $gte: booking.endDate } },
    ]
  });

  if (overlappingBooking) {
    return res.status(400).json({ message: 'Equipment is already booked for the requested extension period' });
  }

  // Update booking with new end date
  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    { 
      endDate: new Date(newEndDate),
      extensionReason
    },
    {
      new: true
    }
  );

  res.status(200).json({
    success: true,
    data: updatedBooking,
    message: 'Booking extended successfully'
  });
});

// @desc    Return equipment
// @route   POST /api/bookings/:id/return
// @access  Private
const returnEquipment = asyncHandler(async (req, res) => {
  const { conditionOnReturn, returnPhotos, digitalSignature } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user has permission to return this booking
  if (req.user.role !== 'admin' && 
      booking.ownerId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to return this equipment' });
  }

  // Update booking status and return information
  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'returned',
      actualReturnTime: new Date(),
      equipmentConditionOnReturn: conditionOnReturn,
      returnVerificationPhotos: returnPhotos,
      digitalSignature
    },
    {
      new: true
    }
  ).populate('equipmentId');

  // Update equipment status back to 'available'
  await Equipment.findByIdAndUpdate(updatedBooking.equipmentId._id, { status: 'available' });

  res.status(200).json({
    success: true,
    data: updatedBooking,
    message: 'Equipment returned successfully'
  });
});

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  extendBooking,
  returnEquipment
};