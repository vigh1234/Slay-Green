const { GoogleGenerativeAI } = require('@google/generative-ai');
const writeDataToJSONFile  = require('../utils/writeData');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const handleVehicleSearch = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Vehicle type, destination1, and prompt are required' });
  }

  try {
    const selectedVehicle = prompt.match(/5\s+(.+?)\s+types/i)?.[1]?.trim();
    const selectedVehicle1 = prompt.match(/types\s+of\s+(.+?)\s+located/i)?.[1]?.trim();
    const destination1 = prompt.match(/located\s+at\s+(.+?)\./i)?.[1]?.trim();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    const vehicleSearchData = {
      selectedDestination: destination1 || 'Unknown destination',
      selectedVehicleType: selectedVehicle1 || 'Unknown Vehicle type',
      selectedVehicleModel: selectedVehicle || 'Unknown vehicle model',
      vehicleDetails: text,
      timestamp: new Date().toISOString(),
    };

    writeDataToJSONFile('GreenVehicleSearch.json', vehicleSearchData);
    res.json({ text });
  } catch (error) {
    console.error('Error getting vehicle type data:', error.message);
    res.status(500).json({ error: 'An error occurred while getting vehicle type data' });
  }
};


module.exports = { handleVehicleSearch };
