import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { api } from "../api/api";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function ClickMarker({ onSet }) {
  useMapEvents({
    click(e) { onSet(e.latlng); }
  });
  return null;
}

export default function MapView({ onResult }) {
  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(false);

  const createAndAnalyze = async () => {
    if (!pos) return alert("Select a point on map");
    setLoading(true);
    try {
      const farm = await api.post("/farms", { name: "Field", center: { lat: pos.lat, lon: pos.lng }, size_km: 1.0 });
      const res = await api.post(`/ndvi/analyze?farm_id=${farm.data.id}`);
      onResult(res.data);
    } catch (e) {
      alert("Error creating or analyzing farm");
    } finally { setLoading(false); }
  };

  return (
    <div className="h-[60vh] rounded overflow-hidden">
      <MapContainer center={[20.2961,85.8245]} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickMarker onSet={setPos} />
        {pos && <Marker position={[pos.lat, pos.lng]}>
          <Popup>
            <div className="w-40">
              <div className="font-semibold">Selected</div>
              <div className="text-xs">Lat {pos.lat.toFixed(4)} Lon {pos.lng.toFixed(4)}</div>
              <button className="mt-2 bg-brand text-white px-3 py-1 rounded" onClick={createAndAnalyze}>{loading ? "…" : "Create & Analyze"}</button>
            </div>
          </Popup>
        </Marker>}
      </MapContainer>
    </div>
  );
}
