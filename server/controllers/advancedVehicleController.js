const { GoogleGenerativeAI } = require('@google/generative-ai');
const writeDataToJSONFile  = require('../utils/writeData');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const handleAdvancedVehicleSearch = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Vehicle type, destination3, and prompt are required' });
  }

  try {
    const AdvancedselectedVehicle = prompt.match(/5\s+(.+?)\s+types/i)?.[1]?.trim();
    const AdvancedselectedVehicle1 = prompt.match(/types\s+of\s+(.+?)\s+located/i)?.[1]?.trim();
    const destination3 = prompt.match(/located\s+at\s+(.+?)\s+also/i)?.[1]?.trim();
    const selectedPreferences1 = prompt.match(/user\s+preference\s+(.+?)\./i)?.[1]?.trim();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    const AdvancedvehicleSearchData = {
      selectedDestination: destination3 || 'Unknown destination',
      selectedPreferences: selectedPreferences1 || 'Unknown preference',
      selectedVehicleType: AdvancedselectedVehicle || 'Unknown Vehicle type',
      selectedVehicleModel: AdvancedselectedVehicle1 || 'Unknown vehicle model',
      vehicleDetails: text,
      timestamp: new Date().toISOString(),
    };

    writeDataToJSONFile('AdvancedGreenVehicleSearch.json', AdvancedvehicleSearchData);
    res.json({ text });
  } catch (error) {
    console.error('Error getting advanced vehicle type data:', error.message);
    res.status(500).json({ error: 'An error occurred while getting advanced vehicle type data' });
  }
};

module.exports = { handleAdvancedVehicleSearch };
  