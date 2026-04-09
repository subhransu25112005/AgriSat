import { useEffect, useState } from "react";
import api from "../api/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// ---- Card Components ----

function CardSkeleton() {
  return (
    <div className="rounded-[2.5rem] bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      <div className="h-8 w-1/2 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
      <div className="h-3 w-3/4 bg-gray-50 dark:bg-gray-800 rounded-full animate-pulse" />
    </div>
  );
}

function RiskBadge({ risk }) {
  // Step 6: Color Intelligence — risk level
  const color =
    risk === "Low" ? "bg-green-100 text-green-700" :
    risk === "Medium" ? "bg-yellow-100 text-yellow-700" :
    "bg-red-100 text-red-700";
  return (
    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest ${color}`}>
      {risk}
    </span>
  );
}

function HealthBar({ score }) {
  const pct = Math.min(100, (score / 10) * 100);
  // Step 6: Color Intelligence — health score thresholds
  const color = pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-yellow-400" : "bg-red-500";
  return (
    <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-3">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

function MoistureBar({ pct }) {
  const clampedPct = Math.min(100, pct ?? 0);
  const color = clampedPct >= 60 ? "bg-blue-500" : clampedPct >= 35 ? "bg-blue-300" : "bg-orange-400";
  return (
    <div className="w-full h-2 bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden mt-3">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clampedPct}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

export default function FarmInsights() {
  const { t } = useTranslation();

  // Step 2: Safe default state
  const [insights, setInsights] = useState({
    health: "Unknown",
    healthScore: 0,
    risk: "Low",
    recommendation: "No data yet.",
    soil: "--",
    moisture: "--",
    temperature: "--",
    humidity: "--",
    summary: "",
    AI_message: "Connecting to intelligence engine..."
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Default coords: Center of India. In production, derive from selected farm.
  const lat = 20.5937;
  const lon = 78.9629;

  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/insights/farm", { params: { lat, lon } });
      console.log("Insights:", res.data); // Debug log (Step 8)
      // Step 4: Map intelligence_engine.py response keys correctly
      setInsights({
        health: res.data?.health_status || "Good",
        healthScore: res.data?.health_score ?? 7,
        risk: res.data?.risk || "Low",
        recommendation: res.data?.recommendation || "Stable",
        soil: res.data?.soil || "Normal",
        moisture: res.data?.moisture || "Moderate",
        moisture_pct: res.data?.moisture_pct ?? 50,
        temperature: res.data?.temperature ?? "--",
        humidity: res.data?.humidity ?? "--",
        summary: `NDVI: ${res.data?.ndvi ?? "N/A"} | ${res.data?.recommendation || ""}`,
        AI_message: res.data?.ai_message || "Your crop is stable."
      });
    } catch (err) {
      console.error("Insights failed:", err);
      setError(true);
      setInsights({
        health: "Unavailable",
        healthScore: 0,
        risk: "Unknown",
        recommendation: "Check your connection.",
        soil: "--",
        moisture: "--",
        moisture_pct: 0,
        temperature: "--",
        humidity: "--",
        summary: "Insights temporarily unavailable.",
        AI_message: "System offline. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 4 & 5: Auto-load + refresh every 30 seconds
  useEffect(() => {
    if (lat && lon) {
      fetchInsights();
      const timer = setInterval(fetchInsights, 30000);
      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [lat, lon]);

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-8 min-h-screen pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[2.6rem] font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Farm <span className="text-green-600">Insights</span>
          </h1>
          <p className="text-gray-400 font-bold mt-2 text-[10px] uppercase tracking-widest">
            AI-powered field intelligence dashboard
          </p>
        </div>
        <button
          onClick={fetchInsights}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase rounded-2xl shadow-xl transition-all active:scale-95"
        >
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && !loading && (
        <div className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl text-red-600 dark:text-red-400 font-bold text-sm">
          ⚠️ Insights temporarily unavailable. Backend connection could not be established.
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 1: Health Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="rounded-[2.5rem] bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700 md:col-span-2 lg:col-span-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-4">🌱 Crop Health Score</p>
            <p className={`text-5xl font-black ${
              (insights?.healthScore ?? 0) >= 7 ? 'text-green-600' :
              (insights?.healthScore ?? 0) >= 4 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {insights?.healthScore ?? "--"}<span className="text-2xl text-gray-400 font-bold">/10</span>
            </p>
            <HealthBar score={insights?.healthScore ?? 0} />
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
              {insights?.summary || "Awaiting telemetry data."}
            </p>
          </motion.div>

          {/* Card 2: Risk Level */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-[2.5rem] bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-4">⚠️ Risk Level</p>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-4xl font-black text-gray-900 dark:text-white">
                {insights?.risk || "--"}
              </p>
              <RiskBadge risk={insights?.risk || "Low"} />
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
              Environmental stress indicators are being monitored.
            </p>
          </motion.div>

          {/* Card 3: AI Smart Recommendation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-[2.5rem] bg-gray-900 p-8 shadow-lg text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">💡 Smart Recommendation</p>
            <p className="text-sm font-bold leading-relaxed text-white/90">
              {insights?.recommendation || "No recommendation available."}
            </p>
          </motion.div>

          {/* Card 4: Soil Type */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] bg-amber-50 dark:bg-amber-900/20 p-8 shadow-lg border border-amber-100 dark:border-amber-800">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-4">🌍 Soil Type</p>
            <p className="text-4xl font-black text-amber-700 dark:text-amber-300 uppercase">
              {insights?.soil || "--"}
            </p>
          </motion.div>

           {/* Card 5: Moisture Level with animated bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-[2.5rem] bg-blue-50 dark:bg-blue-900/20 p-8 shadow-lg border border-blue-100 dark:border-blue-800">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">💧 Moisture Level</p>
            <p className="text-4xl font-black text-blue-700 dark:text-blue-300 uppercase">
              {insights?.moisture || "--"}
            </p>
            <MoistureBar pct={insights?.moisture_pct ?? 0} />
            <p className="text-[10px] font-black text-blue-400 mt-3 uppercase">
              Saturation: {insights?.moisture_pct ?? "--"}% | Humidity: {insights?.humidity}%
            </p>
          </motion.div>

          {/* Card 6: Temperature */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-[2.5rem] bg-rose-50 dark:bg-rose-900/20 p-8 shadow-lg border border-rose-100 dark:border-rose-800">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-4">🌡️ Temperature</p>
            <p className="text-5xl font-black text-rose-600 dark:text-rose-300">
              {insights?.temperature}<span className="text-2xl">°C</span>
            </p>
          </motion.div>
        </div>
      )}

      {/* AI Message Panel */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-[2.5rem] bg-gradient-to-r from-green-600 to-emerald-500 p-8 shadow-2xl text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-3">🤖 AI Field Intelligence</p>
        <p className="text-lg font-bold leading-relaxed">
          {loading ? "Consulting AI advisor..." : (insights?.AI_message || insights?.ai_message)}
        </p>
      </motion.div>
    </div>
  );
}
