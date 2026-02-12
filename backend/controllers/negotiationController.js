const asyncHandler = require('express-async-handler');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Submit a price negotiation for equipment
// @route   POST /api/negotiations
// @access  Private
const submitNegotiation = asyncHandler(async (req, res) => {
  const { productId, offerPrice, message } = req.body;
  
  // Validate required fields
  if (!productId || !offerPrice) {
    return res.status(400).json({ 
      success: false,
      message: 'Product ID and offer price are required' 
    });
  }

  // Validate the product ID format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid product ID format' 
    });
  }

  try {
    // Check if equipment exists
    const equipment = await Equipment.findById(productId);
    if (!equipment) {
      return res.status(404).json({ 
        success: false,
        message: 'Equipment not found' 
      });
    }

    // Check if user is not the owner of the equipment
    if (equipment.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false,
        message: 'You cannot negotiate on your own equipment' 
      });
    }

    // For now, we'll just return success since we don't have a separate negotiation model
    // In a full implementation, you would save the negotiation request to a database
    
    res.status(200).json({
      success: true,
      message: 'Negotiation offer submitted successfully',
      data: {
        productId,
        offerPrice,
        message,
        buyerId: req.user._id
      }
    });
  } catch (error) {
    console.error('Error submitting negotiation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error occurred while submitting negotiation',
      error: error.message 
    });
  }
});

module.exports = {
  submitNegotiation
};