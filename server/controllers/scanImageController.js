const { GoogleGenerativeAI } = require('@google/generative-ai');
const writeDataToJSONFile = require('../utils/writeData');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const analyzeImage = async (req, res) => {
  const { base64Image, prompt } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: 'Base64 image is required' });
  }

  try {
    const categoryMatch = prompt?.match(/most probably this image is from\s+(.+?)\s+category/i);
    const selectedCategory = categoryMatch ? categoryMatch[1].trim() : 'Unknown';

    // Use available Gemini models - try these options:
    const availableModels = [
      'gemini-1.5-flash',  // Fast and efficient
      'gemini-1.0-pro',    // Original pro model
      'gemini-pro',        // Alternative naming
      'gemini-pro-vision'  // Specifically for multimodal
    ];

    // Try gemini-1.5-flash first (recommended for multimodal)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg', // adjust if PNG
      },
    };

    const result = await model.generateContent([
      prompt || "Analyze this image", 
      imagePart
    ]);

    const response = await result.response;
    const text = await response.text();

    const analysisData = {
      selectedCategory,
      imageDetails: text,
      timestamp: new Date().toISOString(),
    };

    writeDataToJSONFile('ImageAnalysis.json', analysisData);

    res.json({ text });
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    res.status(500).json({ error: 'An error occurred while analyzing the image' });
  }
};

module.exports = { analyzeImage };
