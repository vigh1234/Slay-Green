const { GoogleGenerativeAI } = require('@google/generative-ai');
//const writeDataToJSONFile = require('../utils/writeData');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const handleSwappingCenterSearch = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // const vehicleType = prompt.match(/for\s+(.+?)\s+within/i)?.[1]?.trim();
    // const location = prompt.match(/radius\s+of\s+(.+?),\s+operated/i)?.[1]?.trim();
    // const company = prompt.match(/operated\s+by\s+(.+?)\s+in/i)?.[1]?.trim();
    // const subLocation = prompt.match(/in\s+(.+?)\./i)?.[1]?.trim();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    // const swappingCenterData = {
    //   vehicleType: vehicleType || 'Unknown',
    //   mainLocation: location || 'Unknown',
    //   company: company || 'Unknown',
    //   subLocation: subLocation || 'Unknown',
    //   swappingDetails: text,
    //   timestamp: new Date().toISOString(),
    // };

    //writeDataToJSONFile('BatterySwappingCenters.json', swappingCenterData);
    res.json({ text });
  } catch (error) {
    console.error('Error getting battery swapping center data:', error.message);
    res.status(500).json({ error: 'An error occurred while getting swapping center data' });
  }
};

module.exports = { handleSwappingCenterSearch };
