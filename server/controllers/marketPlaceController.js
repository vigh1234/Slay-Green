const { GoogleGenerativeAI } = require("@google/generative-ai");
const writeDataToJSONFile = require('../utils/writeData');
const { getStripe } = require("../utils/stripeClient");


const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const ESGAnalysis = async (req, res) => {
  const { base64Image, prompt } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "Base64 image is required" });
  }

  try {
    // ✅ Use a stable multimodal model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/png", // change to image/jpeg if needed
      },
    };

    const result = await model.generateContent([
      prompt || "Analyze this image and return ESG scores",
      imagePart,
    ]);

    const response = await result.response;
    const text = await response.text();

    const productData = {
          imageDetails: text,
          timestamp: new Date().toISOString(),
        };
    
    writeDataToJSONFile('productAnalysis.json', productData);

    res.json({ text });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({
      error: "An error occurred while analyzing the image",
    });
  }
};


const createMarketPlacePaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body || {};

    if (!Number.isInteger(amount) || amount <= 0 || amount > 99999999) {
      return res.status(400).json({ error: "A valid integer amount is required" });
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

module.exports = { ESGAnalysis, createMarketPlacePaymentIntent };
