const { GoogleGenerativeAI } = require('@google/generative-ai');
const writeDataToJSONFile = require('../utils/writeData');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const handleEcoHotels = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const selectedDestination = prompt.match(/located in\s+(.+?)\./i)?.[1]?.trim();
    const lowerBudgetValue = prompt.match(/ranges from\s+(\d+)/i)?.[1]?.trim();
    const upperBudgetValue = prompt.match(/to\s+(\d+)/i)?.[1]?.trim();
    const selectedCurrency = prompt.match(/selected currency as\s+([^\s]+)/i)?.[1]?.trim();
    const selectedStartDate = prompt.match(/starting from\s+(.+?)\s+to/i)?.[1]?.trim();
    const selectedEndDate = prompt.match(/to\s+(.+?)\./i)?.[1]?.trim();
    const selectedOption = prompt.match(/as\s+(.+?)\s+is\s+the\s+travel\s+party\./i)?.[1]?.trim();

    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    // Send response to client immediately
    res.json({ text });

    // Then perform data write in the background
    const searchData = {
      selectedDestination: selectedDestination || 'Unknown destination',
      MinimumBudget: lowerBudgetValue || 'Unknown budget',
      MaximumBudget: upperBudgetValue || 'Unknown budget',
      currency: selectedCurrency || 'Unknown currency',
      StartDate: selectedStartDate || 'Unknown start date',
      EndDate: selectedEndDate || 'Unknown end date',
      TravelParty: selectedOption || 'Unknown travel party',
      hotelDetails: text,
      timestamp: new Date().toISOString(),
    };

    setImmediate(() => {
      try {
        writeDataToJSONFile('GreenStaySearch.json', searchData);
      } catch (err) {
        console.error('Async write failed:', err.message);
      }
    });

  } catch (error) {
    console.error('Error getting eco-friendly hotels:', error.message);
    res.status(500).json({ error: 'An error occurred while getting eco-friendly hotels' });
  }
};


module.exports = { handleEcoHotels };
























// const { GoogleAuth } = require('google-auth-library');
// const axios = require('axios');

// const PROJECT_ID = 'gen-lang-client-0046090749'; // replace this with your project ID
// const LOCATION = 'us-central1'; // your Vertex AI region, e.g., 'us-central1'
// const MODEL_ID = 'gemini-2.0-flash';

// const handleEcoHotels = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: 'Prompt is required' });
//     }

//     // Authenticate and get access token
//     const auth = new GoogleAuth({
//       scopes: 'https://www.googleapis.com/auth/cloud-platform',
//     });
//     const client = await auth.getClient();
//     const accessToken = await client.getAccessToken();

//     // Prepare request to Gemini 2.0 Flash model endpoint
//     const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predict`;

//     const response = await axios.post(
//       url,
//       {
//         instances: [{ prompt }],
//         parameters: { temperature: 0.7, maxOutputTokens: 1024 },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken.token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // Extract the generated text from the response
//     const output = response.data.predictions?.[0]?.content || 'No output';

//     // Send the response back to frontend
//     res.json({ text: output });

//   } catch (error) {
//     console.error('Error fetching from Gemini 2.0 Flash:', error.message);
//     res.status(500).json({ error: 'Failed to get response from Gemini 2.0 Flash' });
//   }
// };

// module.exports = { handleEcoHotels };




























