const axios = require("axios");

// The original React Native app called Google's Places Autocomplete REST
// endpoint directly from the client, using a key embedded in the app bundle.
// That endpoint doesn't send CORS headers, so a browser can't call it
// directly, and shipping an API key in client-side JS is best avoided anyway.
// This proxy keeps the key server-side and forwards only the search input.
const placesAutocomplete = async (req, res) => {
  const { input } = req.query;

  if (!input) {
    return res.status(400).json({ error: "input query parameter is required" });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    // No key configured: fail soft with an empty prediction list rather than
    // a 500, so the UI's location field still works as a plain text input.
    return res.json({ predictions: [], status: "NOT_CONFIGURED" });
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: { input, types: "(cities)", key: apiKey },
        timeout: 8000,
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Places autocomplete error:", error.message);
    res.status(502).json({ error: "Failed to fetch place suggestions", predictions: [] });
  }
};

module.exports = { placesAutocomplete };
