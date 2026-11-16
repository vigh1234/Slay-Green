const { GoogleGenerativeAI } = require('@google/generative-ai');
const writeDataToJSONFile = require('../utils/writeData');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const handleElectronicSearch = async (req, res) => {
    const { prompt } = req.body;
  
    // Validate the prompt
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
  
    try {
      const electronicType = prompt.match(/list of 6\s+(.+?)\s+available/i)?.[1]?.trim();
      const homeAddress = prompt.match(/available near\s+(.+?)\./i)?.[1]?.trim();
  
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
      // Generate content based on the prompt
      const result = await model.generateContent([prompt]);
      const response = await result.response;
  
      // Check if the response and text exist
      if (!response || !response.text) {
        console.error('Response or text field is missing:', response);
        return res.status(500).json({ error: 'Invalid response format from API' });
      }
  
      const text = await response.text();
  
      const GreenElectronicsSearchData = {
        selectedDestination: homeAddress || 'Unknown destination',
        selectedElectronics: electronicType || 'Unknown Electronic Type',
        electronicDetails: text,
        timestamp: new Date().toISOString(),
      };
  
      writeDataToJSONFile('GreenElectronicsSearch.json', GreenElectronicsSearchData);
  
      res.json({ text });
    } catch (error) {
      console.error('Error generating electronics recommendation:', error.message);
      res.status(500).json({ error: 'An error occurred while generating recommendations' });
    }
  };

  module.exports = {handleElectronicSearch};

