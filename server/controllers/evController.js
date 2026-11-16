const { GoogleGenerativeAI } = require('@google/generative-ai');
//const writeDataToJSONFile = require('../utils/writeData');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const handleEVStations = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    // Send response to client immediately
    res.json({ text });

  } catch (error) {
    console.error('Error getting EV stations:', error.message);
    res.status(500).json({ error: 'An error occurred while getting EV stations' });
  }
};

const handleEVOptions = async (req, res) => {
  const { vehiclePrompt } = req.body;

  if (!vehiclePrompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent([vehiclePrompt]);
    const response = await result.response;
    const text = await response.text();

    // Send response to client immediately
    res.json({ text });

  } catch (error) {
    console.error('Error getting EV stations:', error.message);
    res.status(500).json({ error: 'An error occurred while getting EV stations' });
  }
};


module.exports = { handleEVStations, handleEVOptions };