const express = require('express');
const router = express.Router();
const { handleElectronicSearch } = require('../controllers/electronicSearchController');

//image analysiz
router.post('/recommend-electronics', handleElectronicSearch);


module.exports = router;

