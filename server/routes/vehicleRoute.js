const express = require('express');
const router = express.Router();
const { handleVehicleSearch } = require('../controllers/vehicleController')

//Vehicle Types
router.post('/vehicle-types', handleVehicleSearch);


module.exports = router;