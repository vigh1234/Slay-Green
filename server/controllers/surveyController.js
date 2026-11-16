const writeDataToJSONFile = require('../utils/writeData');

const saveSurveyData = async (req, res) => {
  try {
    const surveyData = req.body;

    if (!surveyData.emailId) {
      return res.status(400).json({ error: 'Email ID is required' });
    }

    const fileName = 'SurveyData.json';
    writeDataToJSONFile(fileName, surveyData);

    res.status(200).json({ message: 'Survey data saved successfully' });
  } catch (error) {
    console.error('Error saving survey data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { saveSurveyData };
