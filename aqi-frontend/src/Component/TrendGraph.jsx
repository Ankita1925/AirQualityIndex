import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

// Optional: Color AQI points based on value
const getAqiColor = (aqi) => {
  if (aqi <= 50) return "#2ecc71"; // Good
  if (aqi <= 100) return "#f1c40f"; // Moderate
  if (aqi <= 150) return "#e67e22"; // Unhealthy for Sensitive Groups
  if (aqi <= 200) return "#e74c3c"; // Unhealthy
  if (aqi <= 300) return "#8e44ad"; // Very Unhealthy
  return "#7e0023"; // Hazardous
};

const TrendGraph = ({ historicalData = [], forecastData = [] }) => {
  if (historicalData.length === 0 && forecastData.length === 0) return null;

  // Merge dates for labels
  const labelsSet = new Set([
    ...historicalData.map((d) => new Date(d.time).toLocaleDateString()),
    ...forecastData.map((d) => new Date(d.time).toLocaleDateString()),
  ]);
  const labels = Array.from(labelsSet);

  // Map AQI values to label dates
  const mapData = (dataArray) => {
    const map = {};
    dataArray.forEach((d) => {
      const date = new Date(d.time).toLocaleDateString();
      map[date] = d.aqi;
    });
    return map;
  };

  const historicalMap = mapData(historicalData);
  const forecastMap = mapData(forecastData);

  const historicalValues = labels.map((l) => historicalMap[l] ?? null);
  const forecastValues = labels.map((l) => forecastMap[l] ?? null);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Historical AQI",
        data: historicalValues,
        fill: false,
        borderColor: "#e74c3c",
        tension: 0.3,
        pointBackgroundColor: historicalValues.map((v) => getAqiColor(v)),
        pointRadius: 5,
      },
      {
        label: "Forecast AQI",
        data: forecastValues,
        fill: false,
        borderColor: "#3498db",
        borderDash: [5, 5],
        tension: 0.3,
        pointBackgroundColor: forecastValues.map((v) => getAqiColor(v)),
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "AQI Trend & Forecast" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "AQI" },
      },
      x: {
        title: { display: true, text: "Date" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TrendGraph;
