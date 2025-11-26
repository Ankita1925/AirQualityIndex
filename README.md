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
| Backend | Node.js|
| API | WAQI (World Air Quality Index) |
| Tools | LocalStorage, Fetch API |
| Mapping | WAQI Tile Server + Iframe |
| Build Tool | Vite |



