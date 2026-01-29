const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  renterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  bookingType: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'returned'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded', 'failed'],
    default: 'pending'
  },
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'moderate'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  deliveryOption: {
    type: String,
    enum: ['self_pickup', 'home_delivery', 'store_pickup'],
    default: 'self_pickup'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: [Number] // [longitude, latitude]
  },
  deliveryCharges: {
    type: Number,
    default: 0
  },
  pickupTime: {
    type: Date
  },
  returnTime: {
    type: Date
  },
  actualReturnTime: {
    type: Date
  },
  lateFee: {
    type: Number,
    default: 0
  },
  damageCharges: {
    type: Number,
    default: 0
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  ratingGiven: {
    type: Boolean,
    default: false
  },
  reviewGiven: {
    type: Boolean,
    default: false
  },
  equipmentConditionOnPickup: {
    type: String,
    enum: ['excellent', 'very-good', 'good', 'fair', 'poor']
  },
  equipmentConditionOnReturn: {
    type: String,
    enum: ['excellent', 'very-good', 'good', 'fair', 'poor']
  },
  pickupVerificationPhotos: [{
    type: String
  }],
  returnVerificationPhotos: [{
    type: String
  }],
  digitalSignature: {
    type: String // Base64 encoded signature
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);