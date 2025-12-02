// src/hooks/useWeather.js
import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (city) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/weather?city=${city}`);
      setWeather(res.data);
    } catch (err) {
      console.log("Weather Error:", err);
    }
    setLoading(false);
  };

  return { weather, fetchWeather, loading };
}
