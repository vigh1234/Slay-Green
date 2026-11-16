const { GoogleGenerativeAI } = require("@google/generative-ai");
const writeDataToJSONFile = require("../utils/writeData");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const handleAdvancedEcoHotels = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const selectedDestination = prompt
      .match(/located in\s+(.+?)\s+which is/i)?.[1]
      ?.trim();
    const selectedPreferences = prompt
      .match(/which is\s+(.+?)\./i)?.[1]
      ?.trim();
    const lowerBudgetValue = prompt.match(/ranges from\s+(\d+)/i)?.[1]?.trim();
    const upperBudgetValue = prompt.match(/to\s+(\d+)/i)?.[1]?.trim();
    const selectedCurrency = prompt
      .match(/selected currency as\s+([^\s]+)/i)?.[1]
      ?.trim();
    const selectedStartDate = prompt
      .match(/starting from\s+(.+?)\s+to/i)?.[1]
      ?.trim();
    const selectedEndDate = prompt
      .match(/starting from\s+.+?\s+to\s+(.+?)\s+as/i)?.[1]
      ?.trim();
    const selectedOption = prompt
      .match(/as\s+(.+?)\s+is\s+the\s+travel\s+party\./i)?.[1]
      ?.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    const advancedSearchData = {
      selectedDestination: selectedDestination || "Unknown destination",
      selectedPreferences: selectedPreferences || "Unknown preference",
      MinimumBudget: lowerBudgetValue || "Unknown budget",
      MaximumBudget: upperBudgetValue || "Unknown budget",
      currency: selectedCurrency || "Unknown currency",
      StartDate: selectedStartDate || "Unknown start date",
      EndDate: selectedEndDate || "Unknown end date",
      TravelParty: selectedOption || "Unknown travel party",
      hotelDetails: text,
      timestamp: new Date().toISOString(),
    };
    writeDataToJSONFile("AdvancedGreenStaySearch.json", advancedSearchData);
    res.json({ text });
  } catch (error) {
    console.error("Error getting advanced eco-friendly hotels:", error.message);
    res
      .status(500)
      .json({
        error: "An error occurred while getting advanced eco-friendly hotels",
      });
  }
};

module.exports = { handleAdvancedEcoHotels };
