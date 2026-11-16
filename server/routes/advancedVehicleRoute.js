const express = require('express');
const router = express.Router();
const { handleAdvancedVehicleSearch} = require('../controllers/advancedVehicleController')

//Advanced Vehicle Types
router.post('/advanced-vehicle-types', handleAdvancedVehicleSearch);

module.exports = router;