const express = require('express');
const router = express.Router();
const { mergeClothingWithESG } = require('../controllers/imageController');

router.post('/merge-clothing-esg', mergeClothingWithESG);


module.exports = router;