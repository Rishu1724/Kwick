const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private/Buyer
const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user is the seller of the product
  if (product.sellerId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot review your own product');
  }

  // Check if user already reviewed this product
  const alreadyReviewed = await Review.findOne({
    buyerId: req.user._id,
    productId
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = new Review({
    productId,
    sellerId: product.sellerId,
    buyerId: req.user._id,
    rating: Number(rating),
    comment
  });

  const createdReview = await review.save();

  // Populate related data
  await createdReview.populate('buyerId', 'name email');
  await createdReview.populate('productId', 'title');

  res.status(201).json(createdReview);
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId })
    .populate('buyerId', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Get reviews for a seller
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
const getSellerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ sellerId: req.params.sellerId })
    .populate('buyerId', 'name email avatar')
    .populate('productId', 'title price images')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Buyer
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user is the reviewer
  if (review.buyerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  const updatedReview = await review.save();

  // Populate related data
  await updatedReview.populate('buyerId', 'name email');
  await updatedReview.populate('productId', 'title');

  res.json(updatedReview);
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Buyer
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user is the reviewer
  if (review.buyerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await review.remove();

  res.json({ message: 'Review removed' });
});

module.exports = {
  createReview,
  getProductReviews,
  getSellerReviews,
  updateReview,
  deleteReview
};