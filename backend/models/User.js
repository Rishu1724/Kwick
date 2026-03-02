const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['renter', 'owner', 'both', 'admin'],
    default: 'renter'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    coordinates: [Number] // [longitude, latitude]
  },
  location: {
    city: String,
    state: String,
    pincode: String
  },
  verifiedDocuments: [{
    type: String, // Types of documents verified: 'id', 'address', 'business_license'
    enum: ['id', 'address', 'business_license', 'insurance']
  }],
  documentUrls: [{
    documentType: String,
    documentUrl: String
  }],
  rentalHistory: [{
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment'
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    date: {
      type: Date
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  paymentMethods: [{
    type: {
      type: String,
      enum: ['card', 'upi', 'net_banking', 'paypal', 'stripe']
    },
    provider: String,
    lastFour: String,
    expiry: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  ratingsReceived: {
    total: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  kycVerified: {
    type: Boolean,
    default: false
  },
  age: {
    type: Number,
    min: 13
  },
  avatar: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);