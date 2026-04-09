// src/components/FarmCard.jsx
import React from "react";

export default function FarmCard({ farm, onAnalyze, onSelect }) {
  return (
    <div className="card p-3 hover:shadow-lg transition-shadow cursor-pointer" onClick={()=> onSelect && onSelect(farm)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{farm.name}</div>
          <div className="text-sm text-gray-500">Size: {farm.size_km} km</div>
          <div className="text-xs text-gray-400 mt-1">{farm.center ? `${farm.center.lat.toFixed(3)}, ${farm.center.lon.toFixed(3)}` : ''}</div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={(e)=>{ e.stopPropagation(); onAnalyze && onAnalyze(farm); }} className="bg-brand text-white px-3 py-1 rounded shadow-sm hover:scale-105 transition-transform">Analyze</button>
          <button onClick={(e)=>{ e.stopPropagation(); alert('Open farm'); }} className="border px-3 py-1 rounded text-sm">Open</button>
        </div>
      </div>
    </div>
  );
}
