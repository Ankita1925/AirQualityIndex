import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Css/AqiStyle.css";

const AqiMap = ({ city }) => {
  useEffect(() => {
    if (!city || !city.geo) return;

    const [lat, lon] = city.geo;

    // Initialize map
    const map = L.map("aqi-map", {
      center: [lat, lon],
      zoom: 10,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }),
      ],
    });

    // Add WAQI overlay tile
    L.tileLayer(
      `https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=YOUR_WAQI_API_TOKEN`,
      { opacity: 0.7 }
    ).addTo(map);

    // Marker for the city
    L.marker([lat, lon]).addTo(map).bindPopup(city.name).openPopup();

    // Cleanup on unmount
    return () => map.remove();
  }, [city]);

  if (!city || !city.geo) return null;

  return (
    <div className="map-container">
      <h3>📍 Air Quality Map</h3>
      <div id="aqi-map" style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
};

export default AqiMap;
