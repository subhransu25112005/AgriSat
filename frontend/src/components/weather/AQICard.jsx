import React from "react";

export default function AQICard({ aqi }) {
  if (!aqi) return null;

  const level = aqi.main.aqi;

  const text = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][level - 1];

  const colors = ["green", "blue", "yellow", "orange", "red"];

  return (
    <div className="bg-white/80 p-5 rounded-2xl shadow-lg border mb-10">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Air Quality</h2>

      <div className="flex justify-between items-center">
        <div className="text-xl font-bold text-gray-700">{text}</div>
        <div
          className={`px-4 py-2 rounded-xl text-white`}
          style={{ background: colors[level - 1] }}
        >
          AQI {level}
        </div>
      </div>
    </div>
  );
}
