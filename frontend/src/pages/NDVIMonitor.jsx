/**
 * src/pages/NDVIMonitor.jsx
 * Map-first NDVI monitor: shows farms, lets user pick a farm to view NDVI overlay and run analyze
 *
 * Note: for NDVI overlay we rely on backend for real NDVI tiles or use SentinelHub instance id.
 * This page shows an approachable UI: farm list -> view on map -> analyze.
 */
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, WMSTileLayer } from "react-leaflet";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";

export default function NDVIMonitor() {
  const { t } = useTranslation();
  const [farms, setFarms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ndvi, setNdvi] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadFarms(); }, []);

  async function loadFarms() {
    try {
      const r = await api.get("/farms");
      setFarms(r.data || []);
    } catch (e) { console.error(e); }
  }

  const analyze = async (farm) => {
    setLoading(true);
    try {
      const res = await api.post(`/ndvi/analyze?farm_id=${farm.id}`);
      setNdvi(res.data);
      setSelected(farm);
    } catch (e) { console.error(e); alert(t("errors.analysis_failed", "Analysis failed")); }
    finally { setLoading(false); }
  };

  const sentinelInstance = (import.meta.env.VITE_SENTINEL_INSTANCE_ID || null);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="card p-2">
            <MapContainer center={[20.2961, 85.8245]} zoom={6} style={{ height: "60vh", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* If you have sentinel instance id and WMS endpoint, you can show NDVI overlay */}
              {sentinelInstance && (
                <WMSTileLayer
                  url={`https://services.sentinel-hub.com/ogc/wms/${sentinelInstance}`}
                  layers="NDVI"
                  format="image/png"
                  transparent={true}
                />
              )}
              {farms.map(f => {
                const c = f.center || (f.geom?.coordinates?.[0]?.[0] ? { lat: f.geom.coordinates[0][0][1], lon: f.geom.coordinates[0][0][0] } : null);
                return c ? (
                  <Marker key={f.id} position={[c.lat, c.lon]}>
                    <Popup>
                      <div className="w-44">
                        <div className="font-semibold">{f.name}</div>
                        <div className="text-xs">{t("ndvi.size", "Size")}: {f.size_km} km</div>
                        <div className="mt-2">
                          <button className="bg-brand text-white px-2 py-1 rounded text-xs" onClick={() => analyze(f)}>{loading ? t("common.loading") : t("ndvi.analyze")}</button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ) : null;
              })}
            </MapContainer>
          </div>
        </div>

        <div className="space-y-3">
          <div className="card p-3">
            <h4 className="font-semibold mb-2">{t("ndvi.farmList")}</h4>
            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {farms.map(f => (
                <div key={f.id} className="p-2 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-xs text-gray-500">{t("ndvi.size", "Size")}: {f.size_km} km</div>
                  </div>
                  <div>
                    <button className="bg-brand text-white px-2 py-1 rounded text-xs" onClick={() => { setSelected(f); setNdvi(null); }}>{t("ndvi.analyze")}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-3">
            <h4 className="font-semibold">{t("ndvi.result")}</h4>
            {ndvi ? (
              <div>
                <div className="text-2xl font-bold text-brand">{ndvi.ndvi_mean ?? "N/A"}</div>
                <div className="text-sm text-gray-600 mt-1">{t("ndvi.source")}: {ndvi.source}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">{t("ndvi.noResult")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
