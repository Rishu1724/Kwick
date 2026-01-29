const Favorite = require('../models/Favorite');
const Equipment = require('../models/Equipment');
const asyncHandler = require('express-async-handler');

// @desc    Add equipment to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Check if equipment exists
  const equipment = await Equipment.findById(productId);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipment not found');
  }

  // Check if already favorited
  const alreadyFavorited = await Favorite.findOne({
    userId: req.user._id,
    productId,
  });

  if (alreadyFavorited) {
    res.status(400);
    throw new Error('Equipment already favorited');
  }

  const favorite = new Favorite({
    userId: req.user._id,
    productId,
  });

  const createdFavorite = await favorite.save();
  res.status(201).json(createdFavorite);
});

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id }).populate(
    'productId'
  );
  res.json(favorites);
});

// @desc    Remove equipment from favorites
// @route   DELETE /api/favorites/:productId
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOne({
    userId: req.user._id,
    productId: req.params.productId,
  });

  if (favorite) {
    await favorite.remove();
    res.json({ message: 'Equipment removed from favorites' });
  } else {
    res.status(404);
    throw new Error('Favorite equipment not found');
  }
});

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};