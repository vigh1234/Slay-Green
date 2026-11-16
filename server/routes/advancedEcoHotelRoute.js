const express = require('express');
const router = express.Router();
const {handleAdvancedEcoHotels} = require('../controllers/advancedEcoHotelController');


// Advanced eco hotels endpoint
router.post('/advanced-eco-hotels', handleAdvancedEcoHotels);

module.exports = router;