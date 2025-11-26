// aqiService.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const NodeCache = require('node-cache');

// ------------------------------
// Cache Setup
// ------------------------------
const cityCache = new NodeCache({
  stdTTL: 3600,  // 1 hour TTL
  maxKeys: 500
});

const AQI_API_URL = "https://api.waqi.info/feed/";
const AQI_API_TOKEN = process.env.AQI_API_TOKEN;

// ------------------------------
// HELPER: Generate Mock Historical AQI
// ------------------------------
function generateMockHistorical(currentAqi) {
  const today = new Date();
  const historical = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    historical.push({
      time: date.toISOString(),
      aqi: Math.max(0, Math.min(500, Math.round(currentAqi + (Math.random() * 40 - 20))))
    });
  }
  return historical;
}

// ------------------------------
// MAIN FUNCTION
// ------------------------------
async function getAqiByCity(cityName) {
  if (!cityName || typeof cityName !== "string") {
    return { error: "Invalid city input." };
  }

  const cacheKey = cityName.trim().toLowerCase();

  // ----- 1. Check Cache -----
  const cachedData = cityCache.get(cacheKey);
  if (cachedData) {
    console.log(`[Cache] HIT → ${cityName}`);
    return cachedData;
  }
  console.log(`[Cache] MISS → ${cityName}`);

  // API Token Check
  if (!AQI_API_TOKEN) {
    return { error: "Server configuration error: Missing AQI API token." };
  }

  try {
    // ----- 2. Call External API -----
    const url = `${AQI_API_URL}${encodeURIComponent(cityName)}/?token=${AQI_API_TOKEN}`;
    const response = await fetch(url);

    if (!response.ok) {
      return {
        error: "AQI API returned a bad response.",
        status: response.status,
        message: response.statusText
      };
    }

    const data = await response.json();

    // ----- 3. Handle API Error -----
    if (!data || data.status !== "ok" || !data.data) {
      return {
        error: "City not found or AQI API error.",
        details: data
      };
    }

    // ----- 4. Add Mock Historical Data -----
    data.data.historical = generateMockHistorical(data.data.aqi);

    // ----- 5. Save to Cache -----
    cityCache.set(cacheKey, data);
    console.log(`[Cache] STORED → ${cityName}`);

    return data;

  } catch (err) {
    console.error("Error fetching AQI:", err);

    return {
      error: "Failed to fetch AQI data. External API unreachable.",
      details: err.message
    };
  }
}

module.exports = { getAqiByCity };
