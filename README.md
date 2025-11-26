# AirQualityIndex
 # 🌍 Real-Time Air Quality Dashboard

A modern, responsive **Air Quality Index (AQI) Dashboard** built using **React.js**, displaying real-time air quality, pollutant breakdown, forecasts, historical trends, and a live AQI map using **WAQI Tiles API**.

This project allows users to:
- Search any city
- View real-time AQI data
- Visualize pollutant levels
- Track historical & forecast trends using charts
- View the city on an air-quality heatmap
- Save their favorite cities

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](Screenshot_26-11-2025_235916_localhost.jpeg)



---

## 🚀 Features

### 🔎 **Search Any City**
- Auto-suggestions while typing
- Real-time AQI from backend API

### 🌬 **AQI Status with Color Indicators**
- Good → Hazardous scale  
- Color-coded AQI circle

### 💨 **Pollutant Breakdown**
Shows:
- PM2.5  
- PM10  
- NO2  
- SO2  
- O3  
- CO  
- Temperature  
- Humidity  
- Wind

### 📊 **Historical + Forecast Trend Graph**
- Line graph using Chart.js  
- Seven-day mock historical data  
- Three-day forecast from WAQI

### ⭐ **Favorite Cities**
- Save to LocalStorage  
- 1-click view for quick access

### 🗺 **AQI Heat Map**
- Integrated **WAQI Tile Map** using latitude & longitude  
- Auto-positions based on searched city

---

## 🛠️ Tech Stack

| Category | Technology |
|---------|------------|
| Frontend | React.js, Chart.js, CSS |
| API | WAQI (World Air Quality Index) |
| Tools | LocalStorage, Fetch API |
| Mapping | WAQI Tile Server + Iframe |
| Build Tool | Vite |

---

## 📁 Folder Structure
aqi-dashboard/
│
├── public/
│    └── vite.svg
│
├── src/
│    ├── Components/
│    │    ├── AqiSearch.jsx        # Search bar + suggestions
│    │    ├── AqiDisplay.jsx       # Main AQI card (AQI circle, pollutants)
│    │    ├── TrendGraph.jsx       # Historical + forecast graph
│    │    └── AqiMap.jsx           # WAQI map integration
│    │
│    ├── Services/
│    │    ├── aqiService.js        # Fetch AQI data from backend WAQI API
│    │    └── favoriteService.js   # LocalStorage favorites utility
│    │
│    ├── Css/
│    │    └── AqiStyle.css         # Global styles for AQI UI
│    │
│    ├── App.jsx
│    └── main.jsx
│
├── screenshots/
│    ├── home.png
│    ├── aqi_display.png
│    ├── graph.png
│    └── map.png
│
├── .env                            # Contains WAQI API Token (not committed)
├── package.json
├── vite.config.js
└── README.md




