const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Equipment = require('../models/Equipment');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId, amount, paymentMethod, currency = 'INR' } = req.body;

  // Verify booking exists and belongs to user
  const booking = await Booking.findById(bookingId).populate('equipmentId');
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (booking.renterId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to make payment for this booking' });
  }

  if (booking.status !== 'pending') {
    return res.status(400).json({ message: 'Payment can only be made for pending bookings' });
  }

  // In a real implementation, you would integrate with Stripe/PayPal/Razorpay here
  // For now, we'll simulate creating a payment record
  
  const payment = await Payment.create({
    bookingId,
    userId: req.user._id,
    amount,
    currency,
    paymentMethod,
    status: 'pending',
    netAmount: amount // Simplified for now
  });

  // Update booking status to confirmed
  await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });

  res.status(201).json({
    success: true,
    data: {
      paymentId: payment._id,
      clientSecret: 'temp_client_secret_for_demo', // Would be real secret in actual implementation
      payment
    }
  });
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentId, gatewayTransactionId, gatewayOrderId } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  // Check if payment belongs to current user
  if (payment.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to confirm this payment' });
  }

  // Update payment with gateway details and mark as completed
  const updatedPayment = await Payment.findByIdAndUpdate(
    paymentId,
    {
      status: 'completed',
      gatewayTransactionId,
      gatewayOrderId,
      paymentIntentId: req.body.paymentIntentId
    },
    {
      new: true
    }
  );

  // Update booking status to active
  await Booking.findByIdAndUpdate(payment.bookingId, { 
    status: 'active',
    paymentStatus: 'paid'
  });

  res.status(200).json({
    success: true,
    data: updatedPayment
  });
});

// @desc    Process refund
// @route   POST /api/payments/:id/refund
// @access  Private
const processRefund = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  // Only admin or booking owner can process refund
  const booking = await Booking.findById(payment.bookingId);
  if (req.user.role !== 'admin' && 
      booking.renterId.toString() !== req.user._id.toString() &&
      booking.ownerId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to process refund' });
  }

  if (payment.status !== 'completed') {
    return res.status(400).json({ message: 'Can only refund completed payments' });
  }

  // In real implementation, process refund with payment gateway
  const updatedPayment = await Payment.findByIdAndUpdate(
    req.params.id,
    {
      status: 'refunded',
      refundAmount: payment.amount,
      refundReason: reason
    },
    {
      new: true
    }
  );

  res.status(200).json({
    success: true,
    data: updatedPayment,
    message: 'Refund processed successfully'
  });
});

// @desc    Get user payment history
// @route   GET /api/payments/history
// @access  Private
const getUserPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id })
    .populate('bookingId', 'startDate endDate totalAmount status')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('bookingId', 'startDate endDate totalAmount status')
    .populate('userId', 'name email');

  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  // Check authorization
  if (req.user.role !== 'admin' && payment.userId.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to access this payment' });
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Handle payment webhook
// @route   POST /api/payments/webhook
// @access  Public (secured by webhook verification)
const handlePaymentWebhook = asyncHandler(async (req, res) => {
  // In real implementation, verify webhook signature
  const event = req.body;

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update payment status to completed
      const paymentIntent = event.data.object;
      await Payment.findOneAndUpdate(
        { gatewayTransactionId: paymentIntent.id },
        { status: 'completed' }
      );
      break;
    case 'payment_intent.payment_failed':
      // Update payment status to failed
      const failedIntent = event.data.object;
      await Payment.findOneAndUpdate(
        { gatewayTransactionId: failedIntent.id },
        { status: 'failed' }
      );
      break;
    case 'charge.refunded':
      // Process refund
      const refund = event.data.object;
      await Payment.findOneAndUpdate(
        { gatewayTransactionId: refund.charge },
        { 
          status: 'refunded', 
          refundAmount: refund.amount / 100 // Convert from cents
        }
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send('Webhook received');
});

module.exports = {
  createPaymentIntent,
  confirmPayment,
  processRefund,
  getUserPaymentHistory,
  getPaymentById,
  handlePaymentWebhook
};