const express = require('express');
const router = express.Router();
const { handleEcoHotels } = require('../controllers/ecoHotelController');

// Eco hotels endpoint
router.post('/eco-hotels', handleEcoHotels);


module.exports = router;
