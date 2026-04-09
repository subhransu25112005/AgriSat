import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FarmCard({ farm, onAdd }) {
  if (!farm) {
    // Empty state card
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10 text-center cursor-pointer"
        onClick={onAdd}
      >
        <span className="text-4xl mb-3">🌱</span>
        <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">Add your first farm</p>
        <p className="text-sm text-gray-400 mb-4">Start monitoring your fields with AI</p>
        <Link
          to="/add-field"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition"
          onClick={(e) => e.stopPropagation()}
        >
          + Add Farm
        </Link>
      </motion.div>
    );
  }

  const statusColors = {
    healthy: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
    risk:    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
  const status = farm.status || "healthy";
  const statusStyle = statusColors[status] || statusColors.healthy;
  const statusIcon = status === "healthy" ? "✅" : status === "risk" ? "⚠️" : "🟡";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white text-base">{farm.name}</h3>
          {farm.location && (
            <p className="text-xs text-gray-400 mt-0.5">📍 {farm.location}</p>
          )}
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyle}`}>
          {statusIcon} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
        {farm.crop && (
          <span>🌾 {farm.crop}</span>
        )}
        {farm.size_km && (
          <span>📐 {farm.size_km} km²</span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <Link
          to="/ndvi"
          className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 transition"
        >
          View NDVI
        </Link>
        <Link
          to="/farm-insights"
          className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition"
        >
          Insights
        </Link>
      </div>
    </motion.div>
  );
}
