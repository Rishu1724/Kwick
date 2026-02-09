const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',  // Changed from 'Product' to 'Equipment'
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Prevent user from reviewing the same equipment multiple times
reviewSchema.index({ buyerId: 1, productId: 1 }, { unique: true });

// Calculate average rating for equipment
reviewSchema.statics.getAverageRating = async function(productId) {
  const obj = await this.aggregate([
    {
      $match: { productId: mongoose.Types.ObjectId(productId) }
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Equipment').findByIdAndUpdate(productId, {  // Changed from 'Product' to 'Equipment'
      averageRating: obj[0] ? obj[0].averageRating : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.productId);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', async function() {
  await this.constructor.getAverageRating(this.productId);
});

module.exports = mongoose.model('Review', reviewSchema);