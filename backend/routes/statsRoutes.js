const express = require('express');
const { getHomeStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/home', getHomeStats);

module.exports = router;
