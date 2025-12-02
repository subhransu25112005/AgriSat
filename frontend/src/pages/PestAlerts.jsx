import React, { useState, useEffect } from "react";

// Simple mapping: state -> coordinates for NASA POWER
const LOCATION_OPTIONS = {
  Odisha: { lat: 20.26, lon: 85.84 },
  Maharashtra: { lat: 19.75, lon: 75.71 },
  Karnataka: { lat: 15.32, lon: 75.71 },
  Telangana: { lat: 18.11, lon: 79.02 },
  "Uttar Pradesh": { lat: 26.85, lon: 80.95 },
};

export default function PestAlerts() {
  const [stateName, setStateName] = useState("Odisha");
  const [alerts, setAlerts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // whenever state changes -> fetch NASA POWER weather & compute risk
  useEffect(() => {
    const loc = LOCATION_OPTIONS[stateName];
    if (!loc) return;
    fetchNasaWeather(loc.lat, loc.lon);
  }, [stateName]);

  const fetchNasaWeather = async (lat, lon) => {
    setLoading(true);
    setError("");
    setAlerts([]);
    setWeather(null);

    try {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const fmt = (d) =>
        d.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

      const start = fmt(yesterday);
      const end = fmt(today);

      // NASA POWER daily agroclimatology API (no key needed)
      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,RH2M,PRECTOTCORR&community=AG&longitude=${lon}&latitude=${lat}&start=${start}&end=${end}&format=JSON`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("NASA API error: " + res.status);
      }

      const data = await res.json();
      const params = data?.properties?.parameter || {};
      const dates = Object.keys(params.T2M || {});
      const last = dates[dates.length - 1];

      const t = params.T2M?.[last]; // °C
      const rh = params.RH2M?.[last]; // %
      const rain = params.PRECTOTCORR?.[last]; // mm/day

      const weatherInfo = { t, rh, rain, date: last };
      setWeather(weatherInfo);

      const derivedAlerts = computePestRisk(weatherInfo, stateName);
      setAlerts(derivedAlerts);
    } catch (e) {
      console.error(e);
      setError("Unable to load live pest risk right now.");
    }

    setLoading(false);
  };

  // Very simple rule-based risk based on weather
  const computePestRisk = (w, stateName) => {
    if (!w) return [];

    const alerts = [];

    // 1. Fungal diseases (powdery mildew, blight) – warm + humid + some rain
    if (w.t >= 20 && w.t <= 32 && w.rh >= 70 && w.rain > 2) {
      alerts.push({
        name: "Fungal diseases (blight, mildew, leaf spot)",
        risk: "High",
        district: stateName,
        reason: `Temp ${w.t.toFixed(
          1
        )}°C, humidity ${w.rh.toFixed(0)}%, rainfall ${w.rain.toFixed(
          1
        )} mm – ideal for fungal growth.`,
        prevention:
          "Avoid overhead irrigation, ensure proper spacing, remove infected leaves, and spray recommended fungicide or neem-based product.",
      });
    } else if (w.rh >= 60 && w.rain > 0) {
      alerts.push({
        name: "Fungal diseases (general)",
        risk: "Medium",
        district: stateName,
        reason: `Humid conditions with some rainfall – moderate risk of fungal infections.`,
        prevention:
          "Monitor lower leaves for spots, keep field well ventilated, and start preventive sprays if symptoms appear.",
      });
    }

    // 2. Sucking pests (aphids, whitefly, jassids) – warm & dry to moderately humid
    if (w.t >= 22 && w.t <= 35 && w.rh <= 75 && w.rain < 5) {
      alerts.push({
        name: "Sucking pests (aphids, whitefly, jassids)",
        risk: "Medium",
        district: stateName,
        reason: `Warm conditions with limited rain favour sucking pests.`,
        prevention:
          "Use yellow sticky traps, avoid excess nitrogen fertilizer, and spray neem oil 1500 ppm if population crosses ETL.",
      });
    }

    // 3. Fall armyworm / caterpillar activity – warm & relatively dry
    if (w.t >= 23 && w.t <= 34 && w.rain < 10) {
      alerts.push({
        name: "Caterpillar pests (Fall armyworm, bollworms)",
        risk: "Watch",
        district: stateName,
        reason: `Warm temperatures with low rainfall – suitable for caterpillar activity in maize, sorghum & cotton.`,
        prevention:
          "Regularly scout whorl region of maize and squares of cotton. Use pheromone traps and release Trichogramma as per local recommendation.",
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        name: "No major pest risk detected",
        risk: "Low",
        district: stateName,
        reason:
          "Current weather is not highly favourable for common pests. Continue routine monitoring.",
        prevention: "Keep fields clean, remove weeds, and inspect crops weekly.",
      });
    }

    return alerts;
  };

  // ICAR + IMD links (live official sites)
  const icarLink = "https://nriipm.res.in/pestalert.aspx";
  const imdStateBulletin =
    "https://mausam.imd.gov.in/imd_latest/contents/agromet/advisory/englishstate_current.php";

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Pest alerts</h1>
      <p className="text-gray-600 mb-4">
        Live pest risk based on NASA weather + ICAR / IMD advisories
      </p>

      {/* State selector */}
      <label className="block text-gray-600 mb-2 font-medium">
        Select state
      </label>
      <select
        value={stateName}
        onChange={(e) => setStateName(e.target.value)}
        className="w-full border p-3 rounded-lg bg-white shadow mb-4"
      >
        {Object.keys(LOCATION_OPTIONS).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Weather summary */}
      {weather && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-800">
          🌤 <b>Latest NASA weather ({weather.date})</b> – Temp{" "}
          {weather.t.toFixed(1)}°C, RH {weather.rh.toFixed(0)}%, Rain{" "}
          {weather.rain.toFixed(1)} mm
        </div>
      )}

      {loading && (
        <p className="text-gray-600 mt-4">Fetching live pest risk...</p>
      )}
      {error && (
        <p className="text-red-600 mt-4 text-sm">
          {error} (check internet connection)
        </p>
      )}

      {/* Alerts */}
      <div className="space-y-5 mt-4">
        {alerts.map((a, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800">{a.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              🔥 <b>Risk:</b> {a.risk}
            </p>
            <p className="text-sm text-gray-500">
              📍 <b>Area:</b> {a.district}
            </p>
            <p className="text-sm text-gray-600 mt-2">{a.reason}</p>
            <p className="text-gray-700 mt-2">
              <b>What to do:</b> {a.prevention}
            </p>
          </div>
        ))}
      </div>

      {/* Official advisories section */}
      <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
        <h2 className="text-md font-semibold text-emerald-800 mb-1">
          📑 Official advisories
        </h2>
        <p className="text-emerald-800">
          For detailed, crop-wise guidance for your state, check:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>
            <a
              href={icarLink}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 underline"
            >
              ICAR – National Pest Alerts (latest bulletins)
            </a>
          </li>
          <li>
            <a
              href={imdStateBulletin}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 underline"
            >
              IMD – State Agromet Bulletins (choose your state)
            </a>
          </li>
        </ul>
        <p className="text-xs text-emerald-900 mt-2">
          These links open official ICAR & IMD pages with real-time pest and
          weather advisories.
        </p>
      </div>
    </div>
  );
}
