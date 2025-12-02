// src/hooks/useNDVI.js
import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export function useNDVI() {
  const [ndviData, setNdviData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getNDVI = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/ndvi`, { lat, lon });
      setNdviData(res.data);
    } catch (err) {
      console.log("NDVI fetch failed:", err);
    }
    setLoading(false);
  };

  return { ndviData, loading, getNDVI };
}
