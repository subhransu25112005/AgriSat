import { useEffect, useState } from "react";
import NDVILineChart from "../components/charts/NDVILineChart";
import WeatherChart from "../components/charts/weatherChart";
import "../styles/farmInsights.css";
import SatelliteIcon from "../components/icons/SatelliteIcon";

export default function FarmInsights() {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/farm/insights")
      .then((res) => res.json())
      .then((data) => setInsights(data));
  }, []);

  if (!insights) return <p className="loading">Loading Insights...</p>;

  return (
    <div className="insights-wrapper">

      {/* Header */}
      <div className="insights-header">
        <SatelliteIcon size={40} color="#0C6C3E" />
        <h2>Farm Insights</h2>
      </div>

      {/* Summary Card */}
      <div className="summary-card">
        <h3>Overall Field Health</h3>
        <p className="score">{insights.healthScore} / 10</p>
        <p className="summary-text">{insights.summary}</p>
      </div>

      {/* Moisture */}
      <div className="info-card">
        <h3>Soil Moisture</h3>
        <p className="value">{insights.soilMoisture}%</p>
        <p className="info-text">{insights.moistureStatus}</p>
      </div>

      {/* Temperature Impact */}
      <div className="info-card">
        <h3>Temperature Impact</h3>
        <p className="value">{insights.temperature}°C</p>
        <p className="info-text">{insights.tempAdvice}</p>
      </div>

      {/* NDVI Chart */}
      <div className="chart-section">
        <h3>NDVI Trend (Last 7 Days)</h3>
        <NDVILineChart data={insights.ndviHistory} />
      </div>

      {/* Rainfall */}
      <div className="chart-section">
        <h3>Weekly Rainfall</h3>
        <WeatherChart data={insights.rainHistory} />
      </div>

      {/* Fertilizer Recommendation */}
      <div className="info-card recommend">
        <h3>Fertilizer Recommendation</h3>
        <p className="info-text">{insights.fertilizer}</p>
      </div>

      {/* Crop Stress Alert */}
      <div className={`alert-card ${insights.alert.level}`}>
        <h3>Crop Stress Alert</h3>
        <p>{insights.alert.message}</p>
      </div>

      <div style={{ height: "70px" }}></div>
    </div>
  );
}
