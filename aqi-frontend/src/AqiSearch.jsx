import React, { useState } from "react";

const AqiSearch = () => {
  const [city, setCity] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:3001/api/v1/aqi";

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAqiData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/${city}`);
      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "City not found or API error.");
      } else {
        setAqiData(result.data);
      }
    } catch (err) {
      setError("Failed to connect to backend service.");
    } finally {
      setLoading(false);
    }
  };

  // AQI Color & Category
  const getAqiCategory = (aqi) => {
    if (aqi == null) return { label: "Unknown", color: "gray" };
    if (aqi <= 50) return { label: "Good", color: "green" };
    if (aqi <= 100) return { label: "Moderate", color: "yellow" };
    if (aqi <= 150)
      return { label: "Unhealthy for Sensitive Groups", color: "orange" };
    if (aqi <= 200) return { label: "Unhealthy", color: "red" };
    if (aqi <= 300) return { label: "Very Unhealthy", color: "purple" };
    return { label: "Hazardous", color: "maroon" };
  };

  return (
    <div className="aqi-container">
      <h1>Air Quality Index Search</h1>

      {/* Search Box */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (e.g., Delhi)"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Get AQI"}
        </button>
      </form>

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Loading */}
      {loading && <p>Loading data...</p>}

      {/* AQI Data */}
      {aqiData && aqiData.city && (
        <div className="aqi-display">
          <h2>{aqiData.city.name}</h2>

          {/* Main AQI Card */}
          <div
            className="main-aqi"
            style={{
              backgroundColor: getAqiCategory(aqiData.aqi).color,
              padding: "10px",
              borderRadius: "8px",
              color: "#000",
              margin: "10px 0",
            }}
          >
            <h3>AQI: {aqiData.aqi}</h3>
            <p>
              Status: <strong>{getAqiCategory(aqiData.aqi).label}</strong>
            </p>
          </div>

          {/* Pollutant List (SAFE) */}
          <div className="pollutant-details">
            <h4>Individual Pollutant Levels (in µg/m³):</h4>

            {aqiData.iaqi ? (
              <ul>
                {Object.entries(aqiData.iaqi).map(([pollutant, data]) => (
                  <li key={pollutant}>
                    <strong>{pollutant.toUpperCase()}</strong>:{" "}
                    {data?.v ?? "N/A"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pollutant data available.</p>
            )}
          </div>

          {/* Time */}
          {aqiData.time?.s && (
            <p className="time">
              Last updated: {new Date(aqiData.time.s).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AqiSearch;
