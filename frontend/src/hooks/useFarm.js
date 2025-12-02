// src/hooks/useFarm.js
import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export function useFarm(token) {
  const [fields, setFields] = useState([]);

  const fetchFields = async () => {
    try {
      const res = await axios.get(`${API}/farm`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFields(res.data);
    } catch (err) {
      console.log("Field fetch error:", err);
    }
  };

  const addField = async (name, polygon) => {
    try {
      await axios.post(
        `${API}/farm/add`,
        { name, polygon },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchFields();
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  return { fields, fetchFields, addField };
}
