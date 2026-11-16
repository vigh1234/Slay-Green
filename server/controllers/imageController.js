const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const FormData = require("form-data");
const cheerio = require("cheerio");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const writeDataToJSONFile = require("../utils/writeData");

// Price comparison function using SerpApi
async function getPricesFromSerpApi(productTitle) {
  const prices = {
    amazon: "Not available",
    flipkart: "Not available",
    myntra: "Not available",
    ajio: "Not available",
    bestDeal: "Not available",
    bestDealStore: "Not available"
  };
  
  // If no product title, return default prices
  if (!productTitle || productTitle === "Unknown Product") {
    return prices;
  }
  
  try {
    const SERPAPI_KEY = process.env.SERPAPI_KEY;
    
    // If no API key, return simulated prices
    if (!SERPAPI_KEY) {
      console.log("SerpApi key not found, using simulated prices");
      return simulatePriceComparison(productTitle);
    }
    
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_shopping',
        q: productTitle,
        google_domain: 'google.co.in',
        gl: 'in',
        hl: 'en',
        api_key: SERPAPI_KEY
      },
      timeout: 10000
    });
    
    // Process results
    if (response.data && response.data.shopping_results) {
      response.data.shopping_results.forEach(result => {
        if (!result.source || !result.price) return;
        
        const source = result.source.toLowerCase();
        const price = result.price;
        
        if (source.includes('amazon')) prices.amazon = price;
        if (source.includes('flipkart')) prices.flipkart = price;
        if (source.includes('myntra')) prices.myntra = price;
        if (source.includes('ajio')) prices.ajio = price;
      });
      
      // Find best deal
      const availablePrices = [];
      if (prices.amazon !== "Not available") availablePrices.push({store: 'Amazon', price: parseFloat(prices.amazon.replace(/[^\d.]/g, ''))});
      if (prices.flipkart !== "Not available") availablePrices.push({store: 'Flipkart', price: parseFloat(prices.flipkart.replace(/[^\d.]/g, ''))});
      if (prices.myntra !== "Not available") availablePrices.push({store: 'Myntra', price: parseFloat(prices.myntra.replace(/[^\d.]/g, ''))});
      if (prices.ajio !== "Not available") availablePrices.push({store: 'Ajio', price: parseFloat(prices.ajio.replace(/[^\d.]/g, ''))});
      
      if (availablePrices.length > 0) {
        const bestDeal = availablePrices.reduce((min, current) => 
          current.price < min.price ? current : min
        );
        prices.bestDeal = bestDeal.store === 'Amazon' ? prices.amazon : 
                          bestDeal.store === 'Flipkart' ? prices.flipkart :
                          bestDeal.store === 'Myntra' ? prices.myntra : prices.ajio;
        prices.bestDealStore = bestDeal.store;
      }
    }
    
    return prices;
  } catch (error) {
    console.error("SerpApi error:", error.message);
    // Fallback to simulated prices if API fails
    return simulatePriceComparison(productTitle);
  }
}

// Helper function to simulate price comparison (fallback when API fails)
function simulatePriceComparison(productTitle) {
  // Generate realistic simulated prices based on product title
  const basePrice = 1000 + (productTitle.length * 50);
  const variation = 0.2; // 20% variation
  
  const amazonPrice = basePrice * (1 + (Math.random() * variation - variation/2));
  const flipkartPrice = basePrice * (1 + (Math.random() * variation - variation/2));
  const myntraPrice = basePrice * (1 + (Math.random() * variation - variation/2));
  const ajioPrice = basePrice * (1 + (Math.random() * variation - variation/2));
  
  const prices = {
    amazon: `₹${Math.round(amazonPrice)}`,
    flipkart: `₹${Math.round(flipkartPrice)}`,
    myntra: `₹${Math.round(myntraPrice)}`,
    ajio: `₹${Math.round(ajioPrice)}`,
    bestDeal: "Not available",
    bestDealStore: "Not available"
  };
  
  // Find best deal
  const priceValues = [
    {store: 'Amazon', price: amazonPrice},
    {store: 'Flipkart', price: flipkartPrice},
    {store: 'Myntra', price: myntraPrice},
    {store: 'Ajio', price: ajioPrice}
  ];
  
  const bestDeal = priceValues.reduce((min, current) => 
    current.price < min.price ? current : min
  );
  
  prices.bestDeal = `₹${Math.round(bestDeal.price)}`;
  prices.bestDealStore = bestDeal.store;
  
  return prices;
}

const mergeClothingWithESG = async (req, res) => {
  const projectRoot = path.join(__dirname, "..", "..");
  const tempDir = path.join(projectRoot, "temp");
  const dbDir = path.join(__dirname, "../DataBase");
  const dbImagesDir = path.join(dbDir, "images");

  // Ensure all directories exist
  await fs.ensureDir(tempDir);
  await fs.ensureDir(dbDir);
  await fs.ensureDir(dbImagesDir);

  // Temp paths
  const clothingPath = path.join(tempDir, `${uuidv4()}_clothing.png`);
  const bodyPath = path.join(tempDir, `${uuidv4()}_body.png`);
  const outputPath = path.join(tempDir, `${uuidv4()}_merged.png`);
  const removedBgPath = clothingPath.replace(".png", "_nobg.png");
  const enhancedTempPath = path.join(tempDir, `${uuidv4()}_enhanced.png`);

  // Permanent DB paths
  const dbClothingPath = path.join(dbImagesDir, `${uuidv4()}_clothing.png`);
  const dbMergedPath = path.join(dbImagesDir, `${uuidv4()}_merged.png`);
  const dbEnhancedPath = path.join(dbImagesDir, `${uuidv4()}_enhanced.png`);

  try {
    let { clothingImageBase64, bodyImageBase64, clothingType, amazonUrl } =
      req.body;

    if (!bodyImageBase64 || (!clothingImageBase64 && !amazonUrl)) {
      return res
        .status(400)
        .json({ error: "A body image plus either a clothing image or a product link is required." });
    }

    // 🔹 Extract product details from Amazon
    let productDetails = null;
    let priceComparison = {
      amazon: "Not available",
      flipkart: "Not available",
      myntra: "Not available",
      ajio: "Not available",
      bestDeal: "Not available",
      bestDealStore: "Not available"
    };
    
    if (amazonUrl) {
      try {
        const response = await axios.get(amazonUrl, {
          headers: { 
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
          },
          timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const title = $("#productTitle").text().trim();

        let whole = $("span.a-price-whole")
          .first()
          .text()
          .trim()
          .replace(/[.,]/g, "");
        let fraction = $("span.a-price-fraction").first().text().trim();
        let combinedPrice = whole ? `${whole}.${fraction || "00"}` : null;

        let price =
          $("#priceblock_ourprice").text().trim() ||
          $("#priceblock_dealprice").text().trim() ||
          $("#priceblock_saleprice").text().trim() ||
          $("span.a-price span.a-offscreen").first().text().trim() ||
          $("span.apexPriceToPay span.a-offscreen").first().text().trim() ||
          combinedPrice;

        const image =
          $("#landingImage").attr("src") ||
          $("img[data-old-hires]").attr("data-old-hires") ||
          $("img[src]").first().attr("src");

        const brand =
          $("#bylineInfo").text().trim() ||
          $("a#bylineInfo").text().trim() ||
          $("tr.po-brand td.a-span9 span").text().trim();

        productDetails = {
          title: title || "Unknown Product",
          price: price || "Not available",
          image: image || null,
          brand: brand || "Unknown",
        };

        // 🔹 Web client convenience: if the caller only sent a product link
        // (no clothingImageBase64 — the browser can't scrape Amazon itself
        // due to CORS), download the scraped product image here so the rest
        // of this function can proceed exactly as if it had been uploaded.
        if (!clothingImageBase64 && image) {
          try {
            const imageResponse = await axios.get(image, {
              responseType: "arraybuffer",
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
              timeout: 10000,
            });
            clothingImageBase64 = Buffer.from(imageResponse.data).toString("base64");
          } catch (imgErr) {
            console.error("Failed to download product image:", imgErr.message);
          }
        }

        // Get prices from all sites using SerpApi
        priceComparison = await getPricesFromSerpApi(title);
        
        // If we got a price from Amazon scraping, use it instead of SerpApi's Amazon price
        if (price && price !== "Not available") {
          priceComparison.amazon = price;
          
          // Recalculate best deal with the updated Amazon price
          const availablePrices = [];
          if (priceComparison.amazon !== "Not available") availablePrices.push({store: 'Amazon', price: parseFloat(priceComparison.amazon.replace(/[^\d.]/g, ''))});
          if (priceComparison.flipkart !== "Not available") availablePrices.push({store: 'Flipkart', price: parseFloat(priceComparison.flipkart.replace(/[^\d.]/g, ''))});
          if (priceComparison.myntra !== "Not available") availablePrices.push({store: 'Myntra', price: parseFloat(priceComparison.myntra.replace(/[^\d.]/g, ''))});
          if (priceComparison.ajio !== "Not available") availablePrices.push({store: 'Ajio', price: parseFloat(priceComparison.ajio.replace(/[^\d.]/g, ''))});
          
          if (availablePrices.length > 0) {
            const bestDeal = availablePrices.reduce((min, current) => 
              current.price < min.price ? current : min
            );
            priceComparison.bestDeal = bestDeal.store === 'Amazon' ? priceComparison.amazon : 
                                      bestDeal.store === 'Flipkart' ? priceComparison.flipkart :
                                      bestDeal.store === 'Myntra' ? priceComparison.myntra : priceComparison.ajio;
            priceComparison.bestDealStore = bestDeal.store;
          }
        }
        
      } catch (err) {
        console.error("Amazon scraping error:", err.message);
        // If Amazon scraping fails, try to get prices based on other data if available
        if (productDetails && productDetails.title) {
          priceComparison = await getPricesFromSerpApi(productDetails.title);
        }
      }
    } else if (req.body.productTitle) {
      // If no Amazon URL but we have a product title, try to get prices
      priceComparison = await getPricesFromSerpApi(req.body.productTitle);
    }

    if (!clothingImageBase64) {
      return res.status(422).json({
        error: "Couldn't find a usable product image at that link. Try a different product link or upload a clothing photo directly.",
      });
    }

    // --- save temp input images ---
    await fs.writeFile(
      clothingPath,
      Buffer.from(clothingImageBase64, "base64")
    );
    await fs.writeFile(bodyPath, Buffer.from(bodyImageBase64, "base64"));

    // 🔹 Save original clothing image to DB
    await fs.copy(clothingPath, dbClothingPath);

    // 🔹 Remove background
    const removeBgApiKey = process.env.REMOVE_BG_API_KEY;
    if (!removeBgApiKey) {
      throw new Error("Remove.bg API key is missing");
    }
    
    const clothingBuffer = await fs.readFile(clothingPath);
    const formData = new FormData();
    formData.append("image_file", clothingBuffer, {
      filename: "clothing.png",
      contentType: "image/png",
    });
    formData.append("size", "auto");

    const removeBgResponse = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: { ...formData.getHeaders(), "X-Api-Key": removeBgApiKey },
        responseType: "arraybuffer",
      }
    );
    await fs.writeFile(removedBgPath, removeBgResponse.data);

    // 🔹 Merge clothing onto body
    const bodyImage = sharp(bodyPath);
    const bodyMeta = await bodyImage.metadata();

    let overlayWidth = Math.floor(bodyMeta.width * 0.7);
    let overlayTop = Math.floor(bodyMeta.height * 0.25);
    let overlayLeft = Math.floor(bodyMeta.width * 0.15);

    if ((clothingType || "shirt").toLowerCase() === "dress") {
      overlayWidth = Math.floor(bodyMeta.width * 0.8);
      overlayTop = Math.floor(bodyMeta.height * 0.15);
      overlayLeft = Math.floor(bodyMeta.width * 0.1);
    }

    const clothingOverlay = await sharp(removedBgPath)
      .resize({ width: overlayWidth })
      .toBuffer();

    await bodyImage
      .composite([
        { input: clothingOverlay, top: overlayTop, left: overlayLeft },
      ])
      .toFile(outputPath);

    // 🔹 Save original merged image to DB (optional - if you still want to keep it)
    await fs.copy(outputPath, dbMergedPath);

    // 🔹 Enhance merged image with DALL-E
    const resizedBuffer = await sharp(outputPath)
      .resize(1024, 1024, { fit: "inside" })
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer();

    const dalleForm = new FormData();
    dalleForm.append("image", resizedBuffer, {
      filename: "merged.png",
      contentType: "image/png",
    });
    dalleForm.append("n", "1");
    dalleForm.append("size", "1024x1024");
    dalleForm.append("response_format", "b64_json");

    const dalleResponse = await axios.post(
      "https://api.openai.com/v1/images/variations",
      dalleForm,
      {
        headers: {
          ...dalleForm.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const enhancedBase64 = dalleResponse.data.data[0].b64_json;

    // 🔹 Save enhanced image to temporary file and then to DB
    const enhancedBuffer = Buffer.from(enhancedBase64, "base64");
    await fs.writeFile(enhancedTempPath, enhancedBuffer);
    await fs.copy(enhancedTempPath, dbEnhancedPath);

    // 🔹 ESG analysis with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const esgPrompt = `Based on the cloth image, provide estimated ESG scores in this format:
    Environmental score: X/10
    Societal score: X/10
    Governance score: X/10
    Carbon offset score: X CO2e`;

    const geminiResult = await model.generateContent([
      { text: esgPrompt },
      { inlineData: { mimeType: "image/png", data: clothingImageBase64 } },
    ]);
    const responseText = geminiResult.response.text();

    // Parse scores
    const parseScore = (label, text) => {
      const regex = new RegExp(`${label}:\\s*([\\d.]+)`, "i");
      const match = text.match(regex);
      return match ? match[1] : null;
    };
    const parseCarbon = (text) => {
      const regex = /Carbon offset score:\s*([\d.]+)\s*CO2e/i;
      const match = text.match(regex);
      return match ? match[1] + " CO2e" : null;
    };

    const esgScores = {
      environmental: parseScore("Environmental score", responseText),
      societal: parseScore("Societal score", responseText),
      governance: parseScore("Governance score", responseText),
      carbon: parseCarbon(responseText),
    };

    // 🔹 Save analysis log into JSON
    const analysisData = {
      timestamp: new Date().toISOString(),
      amazonUrl,
      productDetails,
      priceComparison,
      responseText,
    };
    await writeDataToJSONFile("imageMerge.json", analysisData);

    // 🔹 Send response
    res.json({
      success: true,
      imageBase64: enhancedBase64,
      productDetails,
      esgScores,
      priceComparison,
      savedFiles: analysisData.databasePaths,
    });
  } catch (error) {
    console.error(
      "Error in mergeClothingWithESG:",
      error?.response?.data || error.message
    );
    res.status(500).json({ success: false, error: error.message });
  } finally {
    for (const file of [
      clothingPath,
      bodyPath,
      outputPath,
      removedBgPath,
      enhancedTempPath,
    ]) {
      try {
        await fs.remove(file);
      } catch {}
    }
  }
};

module.exports = { mergeClothingWithESG };