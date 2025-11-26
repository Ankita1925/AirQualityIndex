import React, { useState } from "react";
import AqiDisplay from "./AqiDisplay";
import "../Css/AqiStyle.css";

// Example list of cities (you can expand this)
const CITY_LIST = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Pune",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Ahmedabad",
  "Jaipur",
];

const AqiSearch = () => {
  const [city, setCity] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const API_BASE_URL = "http://localhost:3001/api/v1/aqi";

  // Fetch AQI data
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError(null);
    setAqiData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/${city}`);
      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "City not found.");
      } else {
        setAqiData(result.data);
      }
    } catch {
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-suggestion logic
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 0) {
      const filtered = CITY_LIST.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="page-wrapper">
      <div className="main">
        <h1 className="title">
          <span className="emoji">🌍</span> Air Quality Index Search
        </h1>

        <form className="search-box" onSubmit={handleSearch} autoComplete="off">
          <input
            className="city-input"
            type="text"
            placeholder="Enter a city (e.g., Delhi)"
            value={city}
            onChange={handleInputChange}
            required
          />
          <button className="search-btn" type="submit">
            {loading ? "Searching..." : "Search"}
          </button>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((s) => (
                <li
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="suggestion-item"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </form>

        {error && <p className="error-msg">{error}</p>}
        {loading && <p className="loading-msg">Fetching AQI data...</p>}

        {aqiData && <AqiDisplay data={aqiData} />}
      </div>
    </div>
  );
};

export default AqiSearch;
