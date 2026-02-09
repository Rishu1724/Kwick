const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  subCategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'excellent', 'very-good', 'good', 'fair', 'poor'],
    default: 'good'
  },
  age: {
    type: Number, // Age of equipment in months
    min: 0
  },
  replacementValue: {
    type: Number,
    min: 0
  },
  availableQuantity: {
    type: Number,
    default: 1,
    min: 0
  },
  totalQuantity: {
    type: Number,
    default: 1,
    min: 1
  },
  hourlyRate: {
    type: Number,
    min: 0
  },
  dailyRate: {
    type: Number,
    min: 0
  },
  weeklyRate: {
    type: Number,
    min: 0
  },
  monthlyRate: {
    type: Number,
    min: 0
  },
  securityDeposit: {
    type: Number,
    min: 0
  },
  lateFeePerDay: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  location: {
    city: String,
    state: String,
    pincode: String,
    coordinates: [Number] // [longitude, latitude]
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance', 'retired', 'inactive'],
    default: 'available'
  },
  views: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  qrCode: {
    type: String // QR code identifier for the equipment
  },
  maintenanceLogs: [{
    date: Date,
    description: String,
    performedBy: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for getting reviews for this equipment
equipmentSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  justOne: false
});

module.exports = mongoose.model('Equipment', equipmentSchema);