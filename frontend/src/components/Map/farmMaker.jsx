// src/components/Map/FarmMarker.jsx
import React from "react";
import { Marker, Popup } from "react-leaflet";

export default function FarmMarker({ farm, onAnalyze, onSelect }) {
  const c = farm.center || (farm.geom?.coordinates?.[0]?.[0] ? { lat: farm.geom.coordinates[0][0][1], lon: farm.geom.coordinates[0][0][0] } : null);
  if (!c) return null;
  return (
    <Marker position={[c.lat, c.lon]}>
      <Popup>
        <div className="w-44">
          <div className="font-semibold">{farm.name}</div>
          <div className="text-xs text-gray-500">Size: {farm.size_km} km</div>
          <div className="mt-2 flex gap-2">
            <button className="bg-brand text-white px-2 py-1 rounded text-xs" onClick={()=> onAnalyze && onAnalyze(farm)}>Analyze</button>
            <button className="border px-2 py-1 rounded text-xs" onClick={()=> onSelect && onSelect(farm)}>Open</button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
