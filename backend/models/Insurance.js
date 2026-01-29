const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planType: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'comprehensive'],
    required: true
  },
  coverageAmount: {
    type: Number,
    required: true,
    min: 0
  },
  premiumAmount: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'claimed', 'cancelled'],
    default: 'active'
  },
  claimId: {
    type: String
  },
  claimAmount: {
    type: Number,
    default: 0
  },
  claimStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'settled']
  },
  claimReason: {
    type: String,
    maxlength: [500, 'Claim reason cannot exceed 500 characters']
  },
  claimDocuments: [{
    type: String // Document URLs or paths
  }],
  claimDate: {
    type: Date
  },
  approvedDate: {
    type: Date
  },
  settlementDate: {
    type: Date
  },
  deductible: {
    type: Number,
    default: 0
  },
  coveredDamages: [{
    type: String
  }],
  exclusions: [{
    type: String
  }],
  policyNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Insurance', insuranceSchema);