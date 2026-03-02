const asyncHandler = require('express-async-handler');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

const ACTIVE_EQUIPMENT_STATUSES = ['available', 'rented', 'maintenance'];

// @desc    Home page stats
// @route   GET /api/stats/home
// @access  Public
const getHomeStats = asyncHandler(async (req, res) => {
  const [activeListings, happyRenters, equipmentOwners, citiesAgg] = await Promise.all([
    Equipment.countDocuments({ status: { $in: ACTIVE_EQUIPMENT_STATUSES } }),
    User.countDocuments({ role: { $in: ['renter', 'both'] } }),
    User.countDocuments({ role: { $in: ['owner', 'both'] } }),
    Equipment.aggregate([
      {
        $match: {
          status: { $in: ACTIVE_EQUIPMENT_STATUSES },
          'location.city': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: { $toLower: '$location.city' }
        }
      },
      {
        $count: 'count'
      }
    ])
  ]);

  const citiesCovered = Array.isArray(citiesAgg) && citiesAgg.length > 0 ? citiesAgg[0].count : 0;

  res.status(200).json({
    success: true,
    data: {
      activeListings,
      happyRenters,
      citiesCovered,
      equipmentOwners
    }
  });
});

module.exports = {
  getHomeStats
};
