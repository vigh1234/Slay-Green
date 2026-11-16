const express = require('express');
const router = express.Router();
const { generateVideo } = require('../controllers/videoSearchController');

//video search
router.post('/generate-video', generateVideo);


module.exports = router;

