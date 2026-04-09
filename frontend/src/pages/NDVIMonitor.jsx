import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import api from "../api/api";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import "leaflet/dist/leaflet.css";

// Register ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function NDVIMonitor() {
  const { t } = useTranslation();
  
  // Data States
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [ndviImage, setNdviImage] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Discrete Intelligence States
  const [mlData, setMlData] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [adviceData, setAdviceData] = useState(null);
  const [weatherData, setWeatherData] = useState(null); 
  const [analytics, setAnalytics] = useState(null);
  
  // UI Loading States (Decoupled)
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [mlLoading, setMLLoading] = useState(false);
  const [yieldLoading, setYieldLoading] = useState(false);
  const [aiLoading, setAILoading] = useState(false);

  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [boundaryActive, setBoundaryActive] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  // Step 4: Call all independently on selectedFarm change (or lat/lon)
  useEffect(() => {
    if (selectedFarm?.center) {
      const { lat, lon } = selectedFarm.center;
      const farm_id = selectedFarm.id;
      
      fetchWeather(lat, lon);
      fetchMLClassification(lat, lon, farm_id);
      fetchYieldPrediction(lat, lon, farm_id);
      fetchAISuggestion(lat, lon, farm_id);
    }
  }, [selectedFarm]);

  // Step 1 & 3: Decoupled Independent API calls securely catching errors
  const fetchWeather = async (lat, lon) => {
    setWeatherLoading(true);
    try {
      const res = await api.get("/weather", { params: { lat, lon } });
      console.log("Weather:", res.data); // Step 8
      setWeatherData({
        temp: res.data.temperature,
        humidity: res.data.humidity,
        condition: res.data.weather
      });
    } catch (err) {
      console.error("Weather failed", err);
      setWeatherData({ temp: "--", humidity: "--", condition: "Unavailable" });
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchMLClassification = async (lat, lon, farm_id) => {
    setMLLoading(true);
    try {
      const res = await api.post("/ndvi/ml/classify", { lat, lon, farm_id });
      console.log("ML:", res.data); // Step 8
      setMlData(res.data);
    } catch (err) {
      console.error("ML Classification failed", err);
      setMlData(null);
    } finally {
      setMLLoading(false);
    }
  };

  const fetchYieldPrediction = async (lat, lon, farm_id) => {
    setYieldLoading(true);
    try {
      const res = await api.post("/ndvi/yield/predict", { lat, lon, farm_id });
      console.log("Yield:", res.data); // Step 8
      setYieldData(res.data);
    } catch (err) {
      console.error("Yield Prediction failed", err);
      setYieldData(null);
    } finally {
      setYieldLoading(false);
    }
  };

  const fetchAISuggestion = async (lat, lon, farm_id) => {
    setAILoading(true);
    try {
      const res = await api.post("/ndvi/ai/advice", { lat, lon, farm_id });
      console.log("AI:", res.data); // Step 8
      setAdviceData(res.data);
    } catch (err) {
      console.error("AI Advice failed", err);
      setAdviceData(null);
    } finally {
      setAILoading(false);
    }
  };

  async function loadFarms() {
    try {
      const r = await api.get("/farms");
      setFarms(r.data || []);
      if (r.data?.length > 0) {
        setSelectedFarm(r.data[0]);
        setMapCenter([r.data[0].center.lat, r.data[0].center.lon]);
      }
    } catch (e) {
      console.error("Failed to load farms", e);
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFarm) return;
    
    // Core map logic
    setLoading(true);
    setNdviImage(null);
    setHistory([]);
    
    const { lat, lon } = selectedFarm.center;
    const farm_id = selectedFarm.id;

    // Refresh all independent API calls alongside new map scan
    fetchWeather(lat, lon);
    fetchMLClassification(lat, lon, farm_id);
    fetchYieldPrediction(lat, lon, farm_id);
    fetchAISuggestion(lat, lon, farm_id);

    try {
      const res = await api.post("/ndvi/analyze", { lat, lon, farm_id });
      if (res.data.status === "success") {
        setNdviImage(res.data.ndvi_image);
        setHistory(res.data.history || []);
        setAnalytics(res.data.analytics);
      }
    } catch (e) {
      console.error("Analysis Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (history.length === 0) return null;
    return {
      labels: history.map(h => new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Growth Trend (NDVI)',
        data: history.map(h => h.ndvi),
        fill: true,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#10b981'
      }]
    };
  }, [history]);

  const imageBounds = useMemo(() => {
    if (!selectedFarm) return null;
    const { lat, lon } = selectedFarm.center;
    return [[lat - 0.01, lon - 0.01], [lat + 0.01, lon + 0.01]];
  }, [selectedFarm]);

  // Step 5: Never block UI. Use dedicated loading states per card.

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen pb-32">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[2.6rem] font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Farm <span className="text-green-600">Ecosystem</span>
          </h1>
          <p className="text-gray-500 font-bold mt-2 uppercase text-[10px] tracking-widest">Multi-spectral Satellite Intelligence cockpit</p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <select 
            className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm outline-none font-bold text-sm min-w-[260px]"
            onChange={(e) => {
              const farm = farms.find(f => f.id === parseInt(e.target.value));
              if (farm) {
                setSelectedFarm(farm);
                setMapCenter([farm.center.lat, farm.center.lon]);
              }
            }}
            value={selectedFarm?.id || ""}
          >
            <option value="" disabled>Switch Active Field</option>
            {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>

          <button 
            onClick={handleAnalyze}
            disabled={!selectedFarm || loading}
            className="bg-green-600 hover:bg-green-700 text-white font-black uppercase px-12 py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Engaging Sensors..." : "Engage AI Scan"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="relative rounded-[3.5rem] overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl h-[650px] bg-gray-100 dark:bg-gray-900 group">
            <MapContainer center={mapCenter} zoom={14} style={{ height: "100%", width: "100%" }} key={`${mapCenter[0]}-${mapCenter[1]}`}>
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <AnimatePresence>
                {ndviImage && imageBounds && (
                  <ImageOverlay url={ndviImage} bounds={imageBounds} opacity={boundaryActive ? 0.35 : 0.8} />
                )}
              </AnimatePresence>
              {selectedFarm?.geom && (
                <GeoJSON data={selectedFarm.geom} style={{ color: boundaryActive ? '#4ade80' : '#ffffff', weight: 4, fillOpacity: boundaryActive ? 0.3 : 0.05, dashArray: '10, 10' }} />
              )}
            </MapContainer>

            {loading && (
              <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                 <div className="w-20 h-20 border-8 border-green-200 border-t-green-600 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* AI INTELLIGENCE GRID */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* ML Classification Card */}
            <div className="p-8 bg-white dark:bg-gray-800 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">🛰 ML Classification</h3>
               {mlLoading ? (
                 <div className="flex flex-col gap-2"><div className="w-full h-8 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg" /><div className="w-1/2 h-4 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-lg" /></div>
               ) : mlData ? (
                 <div className="space-y-2">
                    <p className="text-3xl font-black text-gray-900 dark:text-white uppercase leading-none">{mlData.crop_type}</p>
                    <p className="text-[10px] font-black uppercase text-gray-400">Confidence: {Math.round(mlData.confidence*100)}%</p>
                 </div>
               ) : (
                 <div className="py-6 text-center opacity-40 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Classification Unavailable</div>
               )}
            </div>

            {/* Yield Prediction Card */}
            <div className="p-8 bg-white dark:bg-gray-800 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-6">📉 Yield Prediction</h3>
               {yieldLoading ? (
                 <div className="flex flex-col gap-2"><div className="w-full h-8 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg" /><div className="w-1/2 h-4 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-lg" /></div>
               ) : yieldData ? (
                 <div className="space-y-2">
                    <p className="text-3xl font-black text-gray-900 dark:text-white uppercase leading-none">{yieldData.yield}</p>
                    <p className="text-[10px] font-black uppercase text-green-600">Reliability: {yieldData.confidence}</p>
                 </div>
               ) : (
                 <div className="py-6 text-center opacity-40 text-xs font-black uppercase tracking-[0.2em] text-gray-500">Forecast Unavailable</div>
               )}
            </div>

            {/* AI Suggestion Card */}
            <div className="p-8 bg-gray-900 rounded-[3rem] shadow-xl text-white">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">🌱 AI Suggestion</h3>
               {aiLoading ? (
                 <div className="space-y-3"><div className="w-full h-12 bg-white/10 animate-pulse rounded-xl" /><div className="w-1/2 h-4 bg-white/5 animate-pulse rounded-full" /></div>
               ) : adviceData ? (
                 <div className="space-y-2">
                    <p className="text-sm font-bold leading-relaxed">{adviceData.advice}</p>
                    <div className="text-[10px] font-black uppercase p-1 px-3 bg-white/20 rounded-full inline-block">Risk: {adviceData.risk}</div>
                 </div>
               ) : (
                 <div className="py-6 text-center opacity-40 text-xs font-black uppercase tracking-[0.2em]">Advice Unavailable</div>
               )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="p-10 bg-white dark:bg-gray-900 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10">Temporal Trends</h3>
            <div className="h-[280px] relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>
              ) : chartData ? (
                <Line data={chartData} options={{ maintainAspectRatio: false }} /> 
              ) : (
                <div className="h-full flex items-center justify-center opacity-20 text-5xl">📈</div>
              )}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4">
               <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-2">Area</p>
                  <p className="text-lg font-black dark:text-white">{selectedFarm?.size_km} KM²</p>
               </div>
               <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                  <p className="text-[9px] font-black uppercase text-gray-400 mb-2">Vegetation %</p>
                  {loading ? <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" /> : <p className="text-lg font-black text-green-600">{analytics?.veg_coverage || "0%"}</p>}
               </div>
            </div>
          </div>

          {/* Weather Data Card */}
          <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-[3.5rem] border border-gray-200 dark:border-gray-700">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Atmospheric Intelligence</h4>
             {weatherLoading ? (
                <div className="py-16 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Syncing Telemetry...</p>
                </div>
             ) : weatherData ? (
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <div>
                       <p className="text-[9px] font-black uppercase opacity-40">Temperature</p>
                       <p className="text-3xl font-black dark:text-white uppercase">
                         {weatherData.temp}°C
                       </p>
                     </div>
                     <div className="text-right">
                       <p className="text-[9px] font-black uppercase opacity-40">Humidity</p>
                       <p className="text-3xl font-black dark:text-white uppercase">
                         {weatherData.humidity}%
                       </p>
                     </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl border border-gray-100 dark:border-gray-600">
                     <p className="text-[10px] font-black uppercase opacity-60 mb-1">Condition</p>
                     <p className="text-sm font-black dark:text-white uppercase">
                       {weatherData.condition}
                     </p>
                  </div>
               </div>
             ) : (
                <div className="py-16 text-center opacity-40 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
                   Weather Data Unavailable
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
