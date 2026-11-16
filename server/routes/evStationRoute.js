const express = require('express');
const router = express.Router();
const { handleEVStations } = require('../controllers/evController');
const { handleEVOptions } = require('../controllers/evController')

router.post('/ev-stations', handleEVStations);
router.post('/ev-options', handleEVOptions);


module.exports = router;