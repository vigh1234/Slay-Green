const express = require('express');
const router = express.Router();
const { saveSurveyData } = require('../controllers/surveyController');

router.post('/save-survey-data', saveSurveyData);

module.exports = router;
