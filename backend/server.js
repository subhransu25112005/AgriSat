import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(express.json());   // IMPORTANT

// In-memory database for fields
let userFields = [];

// Your REAL API KEY
const API_KEY = process.env.MARKET_API_KEY || "579b24cd66be62b3dd000000155c59f507c78c6ed47b7cbef58eda1dc5e2";

// =============================
// ⭐ LANGUAGE UPDATE API (fix for 404)
// =============================
app.post("/auth/update-language", (req, res) => {
  const { language } = req.body;

  if (!language) {
    return res.status(400).json({ error: "Language is required" });
  }

  console.log("Language updated to:", language);

  // You can save to DB later — for now, just send success.
  return res.json({ success: true, language });
});

// =============================
//  🌾 MANDI PRICE API
// =============================
app.get("/api/mandi", async (req, res) => {
  const state = req.query.state;
  if (!state) return res.status(400).json({ error: "State required" });

  const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&filters[state]=${state}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data", details: err });
  }
});

// =============================
//  🏛 GOVT SCHEMES (CURATED LOCAL DATA - Production Stable)
// =============================
app.get("/api/schemes", async (req, res) => {
  const q = (req.query.q || "").toLowerCase();

  // Curated list for high stability in production
  const curatedSchemes = [
    { title: "PM-Kisan Samman Nidhi", description: "Direct income support of ₹6,000 per year to all landholding farmer families.", slug: "pm-kisan-samman-nidhi" },
    { title: "Pradhan Mantri Fasal Bima Yojana", description: "Crop insurance against non-preventable natural risks.", slug: "pradhan-mantri-fasal-bima-yojana" },
    { title: "Soil Health Card Scheme", description: "Information to farmers on nutrient status of their soil.", slug: "soil-health-card-scheme" },
    { title: "Kisan Credit Card (KCC)", description: "Timely credit for the agriculture sector.", slug: "kisan-credit-card" },
    { title: "Paramparagat Krishi Vikas Yojana", description: "Promoting organic farming and chemical-free produce.", slug: "paramparagat-krishi-vikas-yojana" }
  ];

  const filtered = curatedSchemes.filter(item =>
    (item.title || "").toLowerCase().includes(q) ||
    (item.description || "").toLowerCase().includes(q)
  );

  res.json({ data: filtered });
});

// =============================
//   📍 USER FIELDS (PRECISION FARMING)
// =============================

// Add new field with boundary
app.post("/api/fields", (req, res) => {
  const { name, lat, lng, boundary } = req.body;

  if (!name || !lat || !lng || !boundary) {
    return res.status(400).json({ error: "Missing data" });
  }

  const newField = {
    id: Date.now(),
    name,
    lat,
    lng,
    boundary, // polygon points
  };

  userFields.push(newField);
  res.json({ message: "Field added", field: newField });
});

// Fetch all fields
app.get("/api/fields", (req, res) => {
  res.json({ data: userFields });
});

// =============================
//   🚀 START SERVER
// =============================
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
