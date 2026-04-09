/**
 * src/pages/AddField.jsx
 * Simple form to add a field by center coordinates or GeoJSON
 */
import React, { useState } from "react";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";

export default function AddField({ onAdded }) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [sizeKm, setSizeKm] = useState(1.0);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !lat || !lon) {
      return alert(t("addField.required", "Please provide name and coordinates"));
    }
    setLoading(true);
    try {
      const payload = {
        name,
        center: { lat: parseFloat(lat), lon: parseFloat(lon) },
        size_km: parseFloat(sizeKm)
      };
      const res = await api.post("/farms", payload);
      alert(t("addField.success", "Field added"));
      if (onAdded) onAdded(res.data);
      setName(""); setLat(""); setLon(""); setSizeKm(1.0);
    } catch (err) {
      console.error(err);
      alert(t("addField.failed", "Failed to add field"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleAdd} className="card p-4 space-y-3">
        <h3 className="font-semibold">{t("addField.title")}</h3>
        <input className="border p-2 rounded w-full" placeholder={t("addField.fieldName")} value={name} onChange={(e)=>setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input className="border p-2 rounded" placeholder={t("addField.latitude")} value={lat} onChange={(e)=>setLat(e.target.value)} />
          <input className="border p-2 rounded" placeholder={t("addField.longitude")} value={lon} onChange={(e)=>setLon(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600">{t("addField.size")}</label>
          <input type="number" step="0.1" className="border p-2 rounded w-32" value={sizeKm} onChange={(e)=>setSizeKm(e.target.value)} />
        </div>
        <div>
          <button className="bg-brand text-white px-4 py-2 rounded">{loading ? t("common.loading") : t("addField.submit")}</button>
        </div>
      </form>
    </div>
  );
}
