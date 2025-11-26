import React, { useState, useEffect, useMemo } from "react";
import "../Css/AqiStyle.css"; // Assuming this is where the new styles go
import {
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaMedkit,
  FaWind,
  FaClock,
  FaGlobe,
} from "react-icons/fa";
import TrendGraph from "./TrendGraph";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../Services/favoriteService";
import AqiMap from "./AqiMap";

// AQI Category Logic (moved out for clean component code)
const getAqiDetails = (aqi) => {
  if (aqi <= 50) return { label: "Good", color: "#2ecc71", risk: "Low Risk" };
  if (aqi <= 100)
    return { label: "Moderate", color: "#f1c40f", risk: "Moderate Risk" };
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive Groups",
      color: "#e67e22",
      risk: "Elevated Risk",
    };
  if (aqi <= 200)
    return { label: "Unhealthy", color: "#e74c3c", risk: "High Risk" };
  if (aqi <= 300)
    return {
      label: "Very Unhealthy",
      color: "#8e44ad",
      risk: "Very High Risk",
    };
  return { label: "Hazardous", color: "#7e0023", risk: "Critical Risk" };
};

const getHealthRecommendation = (label) => {
  switch (label) {
    case "Good":
      return "Air quality is excellent. Enjoy outdoor activities with no restrictions.";
    case "Moderate":
      return "Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.";
    case "Unhealthy for Sensitive Groups":
      return "Sensitive groups (children, elderly, respiratory issues) should reduce prolonged or heavy outdoor exertion. General population is unlikely to be affected.";
    case "Unhealthy":
      return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects. Limit time outdoors.";
    case "Very Unhealthy":
      return "Health warning: air quality is critically harmful. Avoid all outdoor physical activity and wear a mask if you must go outside.";
    case "Hazardous":
      return "Health emergency: Air is severely polluted. Stay indoors, keep windows closed, and run an air purifier if available.";
    default:
      return "Consult local health authorities for specific recommendations.";
  }
};

const AqiDisplay = ({ data }) => {
  const { aqi, city, time, iaqi, dominentpol, forecast, attributions } = data;

  const { label, color, risk } = useMemo(() => getAqiDetails(aqi), [aqi]);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs = getFavorites();
    setIsFavorite(favs.includes(city.name));
  }, [city.name]);

  const toggleFavorite = () => {
    if (isFavorite) removeFavorite(city.name);
    else addFavorite(city.name);
    setIsFavorite(!isFavorite);
  };

  // Pollutant sorting logic optimized with useMemo
  const pollutants = useMemo(() => {
    const pollutantOrder = [
      "pm25",
      "pm10",
      "no2",
      "o3",
      "so2",
      "co",
      "t",
      "h",
      "w",
      "p",
    ];
    return iaqi
      ? Object.entries(iaqi).sort(
          ([a], [b]) => pollutantOrder.indexOf(a) - pollutantOrder.indexOf(b)
        )
      : [];
  }, [iaqi]);

  // Prepare forecast data for TrendGraph
  const forecastData = useMemo(
    () =>
      forecast?.daily?.pm25?.map((d) => ({ time: d.day, aqi: d.avg })) || [],
    [forecast]
  );

  return (
    <div className="aqi-card-container fade-in">
      <div className="aqi-card glass-card">
        {/* === Header: City, Fav, Last Updated === */}
        <header className="aqi-header">
          <h2 className="city-title">
            <FaMapMarkerAlt className="location-icon" /> {city.name}
          </h2>
          <button
            className={`favorite-btn ${isFavorite ? "is-favorite" : ""}`}
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </header>

        {/* === Main AQI Data: Circle & Status === */}
        <div className="aqi-main-data">
          <div className="aqi-circle" style={{ backgroundColor: color }}>
            <span className="aqi-number">{aqi}</span>
            <span className="aqi-label">{label}</span>
          </div>
          <div className="aqi-status-details">
            <p className="status-risk-level" style={{ color: color }}>
              <FaMedkit className="icon-badge" /> {risk}
            </p>
            {dominentpol && (
              <p className="dominant-pollutant-text">
                <FaWind className="icon-badge" /> Dominant Pollutant:
                <span className="dominant-pollutant-value">
                  {" "}
                  {dominentpol.toUpperCase()}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* === Health Recommendation === */}
        <div className="health-box">
          <h3 className="section-title">
            <FaMedkit /> Health Recommendation
          </h3>
          <p className="health-text">{getHealthRecommendation(label)}</p>
        </div>

        {/* === Map Section (Conditional) === */}
        {city.geo && (
          <div className="aqi-map-section">
            <AqiMap city={city} />
          </div>
        )}

        {/* === Pollutants Breakdown === */}
        <section className="pollutant-section">
          <h3 className="section-title">
            <FaWind /> Pollutant Breakdown
          </h3>

          <div className="pollutant-grid">
            {pollutants.map(([key, value]) => {
              // Check if the value is a number before rounding
              const displayValue =
                typeof value?.v === "number"
                  ? value.v.toFixed(1) // <--- THIS IS THE FIX: Rounds to 1 decimal place
                  : "N/A";

              // Exception for very large numbers like Pressure (P)
              // We can round to 0 decimal places for P if we want it to be a clean integer
              const finalDisplayValue =
                key === "p" && typeof value?.v === "number"
                  ? value.v.toFixed(0)
                  : displayValue;

              return (
                <div key={key} className="pollutant-card zoom-in">
                  <h4>{key.toUpperCase()}</h4>
                  <p>
                    {finalDisplayValue} {key !== "p" ? "µg/m³" : ""}
                  </p>
                  {/* Adjusted unit display for Pressure (P) */}
                </div>
              );
            })}
          </div>
        </section>

        {/* === Historical + Forecast Graph === */}
        {(data.historical?.length > 0 || forecastData.length > 0) && (
          <section className="trend-graph-section">
            <h3 className="section-title">📊 7-Day Trend (PM2.5)</h3>
            <TrendGraph
              historicalData={data.historical || []}
              forecastData={forecastData}
            />
          </section>
        )}

        {/* === Footer: Time and Attribution === */}
        <footer className="aqi-footer">
          <p className="updated-time">
            <FaClock className="icon-badge" /> Last Updated:{" "}
            {new Date(time.s).toLocaleString()}
          </p>

          {attributions && attributions.length > 0 && (
            <div className="attribution">
              <p>
                <FaGlobe className="icon-badge" /> Data Source:{" "}
              </p>
              <div className="attribution-links">
                {attributions.map((a, index) => (
                  <a
                    key={a.url}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="attribution-link"
                  >
                    {a.name}
                    {index < attributions.length - 1 && <span>, </span>}
                  </a>
                ))}
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default AqiDisplay;
