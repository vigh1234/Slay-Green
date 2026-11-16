const express = require('express');
const router = express.Router();
const { handleSelectedProviders, getSelectedProviders } = require('../controllers/selectedProviderController');

router.post('/selected-service-providers', handleSelectedProviders);
router.get('/selected-service-providers', getSelectedProviders);


module.exports = router;
