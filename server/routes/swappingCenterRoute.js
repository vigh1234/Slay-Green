const express = require('express');
const router = express.Router();
const { handleSwappingCenterSearch } = require('../controllers/swappingCenterController');

//image analysiz
router.post('/swapping-centers', handleSwappingCenterSearch);


module.exports = router;