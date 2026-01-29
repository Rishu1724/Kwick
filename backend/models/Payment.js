const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet', 'paypal', 'stripe', 'razorpay', 'cod'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'paypal', 'razorpay']
  },
  gatewayTransactionId: {
    type: String
  },
  gatewayOrderId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String // For Stripe payment intents
  },
  receiptUrl: {
    type: String
  },
  securityDeposit: {
    type: Boolean,
    default: false
  },
  partialPayment: {
    type: Boolean,
    default: false
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String
  },
  refundTransactionId: {
    type: String
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  platformFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number, // Amount after platform fees
    required: true
  },
  metadata: {
    type: Object // Additional payment data
  },
  paymentProof: {
    type: String // Path to payment proof image if applicable
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);