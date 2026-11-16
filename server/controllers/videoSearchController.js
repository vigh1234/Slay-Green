const { GoogleGenerativeAI } = require('@google/generative-ai');
const writeDataToJSONFile = require('../utils/writeData');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generateVideo = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const userInput = prompt.match(/list of 6 titles and a short description for each title of:\s*(.+)/i)?.[1]?.trim();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([prompt]);
    const generatedResponse = await result.response.text();

    const videoDetails = {
      userInput: userInput || 'Unknown user input',
      videoDetails: generatedResponse,
      timestamp: new Date().toISOString(),
    };

    writeDataToJSONFile('videoSearch.json', videoDetails);
    res.json({ response: generatedResponse });
  } catch (error) {
    console.error('Error generating video content:', error.message);
    res.status(500).json({ error: 'Failed to generate video content.' });
  }
};

module.exports = { generateVideo };
