import { useEffect, useState } from "react";
import NDVILineChart from "../components/charts/NDVILineChart";
import WeatherChart from "../components/charts/weatherChart";
import "../styles/farmInsights.css";
import SatelliteIcon from "../components/icons/SatelliteIcon";
import { useTranslation } from "react-i18next";

export default function FarmInsights() {
  const { t } = useTranslation();
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/farms/insights`)
      .then((res) => res.json())
      .then((data) => setInsights(data));
  }, []);

  if (!insights) return <p className="loading">{t("common.loading")}</p>;

  return (
    <div className="insights-wrapper">

      {/* Header */}
      <div className="insights-header">
        <SatelliteIcon size={40} color="#0C6C3E" />
        <h2>{t("farmInsights.title")}</h2>
      </div>

      {/* Summary Card */}
      <div className="summary-card">
        <h3>{t("farmInsights.cropHealth", "Overall Field Health")}</h3>
        <p className="score">{insights.healthScore} / 10</p>
        <p className="summary-text">{insights.summary}</p>
      </div>

      {/* Moisture */}
      <div className="info-card">
        <h3>{t("farmInsights.soilMoisture")}</h3>
        <p className="value">{insights.soilMoisture}%</p>
        <p className="info-text">{insights.moistureStatus}</p>
      </div>

      {/* Temperature Impact */}
      <div className="info-card">
        <h3>{t("farmInsights.temperature")}</h3>
        <p className="value">{insights.temperature}°C</p>
        <p className="info-text">{insights.tempAdvice}</p>
      </div>

      {/* NDVI Chart */}
      <div className="chart-section">
        <h3>{t("farmInsights.ndviTrend", "NDVI Trend (Last 7 Days)")}</h3>
        <NDVILineChart data={insights.ndviHistory} />
      </div>

      {/* Rainfall */}
      <div className="chart-section">
        <h3>{t("farmInsights.rainfall")}</h3>
        <WeatherChart data={insights.rainHistory} />
      </div>

      {/* Fertilizer Recommendation */}
      <div className="info-card recommend">
        <h3>{t("farmInsights.fertilizerRec", "Fertilizer Recommendation")}</h3>
        <p className="info-text">{insights.fertilizer}</p>
      </div>

      {/* Crop Stress Alert */}
      <div className={`alert-card ${insights.alert.level}`}>
        <h3>{t("farmInsights.cropStressAlert", "Crop Stress Alert")}</h3>
        <p>{insights.alert.message}</p>
      </div>

      <div style={{ height: "70px" }}></div>
    </div>
  );
}
