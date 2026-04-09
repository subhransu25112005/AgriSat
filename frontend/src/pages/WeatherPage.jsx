import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import WeatherHeader from "../components/weather/WeatherHeader";
import AdvisoryBanner from "../components/weather/AdvisoryBanner";
import WeatherCard from "../components/weather/WeatherCard";
import WeatherChart from "../components/weather/WeatherChart";
import AQICard from "../components/weather/AQICard";
import SprayTimeline from "../components/weather/SprayTimeline";
import FarmInsightsPanel from "../components/weather/FarmInsightsPanel";
import AIChatAssistant from "../components/weather/AIChatAssistant";

// ── Design tokens ─────────────────────────────────────────────────────────────
const GLASS = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(24px) saturate(1.6)",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.35)"
};
const RADIUS = "2rem";

// ── Reusable glass wrapper ────────────────────────────────────────────────────
function Glass({ children, className = "", style = {} }) {
  return (
    <div className={`rounded-[${RADIUS}] p-6 ${className}`} style={{ ...GLASS, borderRadius: RADIUS, ...style }}>
      {children}
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <p className="text-[8px] font-black uppercase tracking-[0.35em] text-white/30 mb-4 pl-1">
      {children}
    </p>
  );
}

// ── Horizontal metric chip ────────────────────────────────────────────────────
function MetricChip({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -3, boxShadow: "0 8px 30px rgba(56,189,248,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex-shrink-0 flex flex-col gap-1.5 px-5 py-4 min-w-[120px] cursor-default"
      style={{ ...GLASS, borderRadius: "1.4rem" }}
    >
      <span className="text-xl leading-none">{icon}</span>
      <p className="text-[7px] font-black uppercase tracking-[0.25em] text-white/30">{label}</p>
      <p className="text-lg font-black text-white leading-none">{value}</p>
    </motion.div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function Skel({ h = "h-40", className = "" }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity }}
      className={`${h} ${className}`}
      style={{ ...GLASS, borderRadius: RADIUS }}
    />
  );
}

// ── Section fade-in ───────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay }
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function WeatherPage() {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advisory, setAdvisory] = useState({ text: "Initializing farm intelligence...", type: "neutral" });
  const [error, setError] = useState("");

  const lat = 20.2961, lon = 85.8245;
  const KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const load = async () => {
    setLoading(true); setError("");
    if (!KEY) { setError("VITE_WEATHER_API_KEY missing."); setLoading(false); return; }
    try {
      const [nR, fR, aR] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${KEY}`)
      ]);
      if (!nR.ok || !fR.ok || !aR.ok) throw new Error();
      const [n, f, a] = await Promise.all([nR.json(), fR.json(), aR.json()]);
      setCurrent(n);
      setForecast(f.list.filter((_, i) => i % 8 === 0).slice(0, 7));
      setHourly(f.list.slice(0, 12));
      setAqi(a.list[0]);
      buildAdvisory(n, f.list.slice(0, 4));
    } catch { setError("Could not load weather. Check API key and connection."); }
    finally { setLoading(false); }
  };

  const buildAdvisory = (w, soon) => {
    const rain = w.weather[0].main.toLowerCase().includes("rain");
    const temp = w.main.temp, wind = w.wind.speed;
    const soonR = soon.some(h => h.weather[0].main.toLowerCase().includes("rain"));
    if (rain) setAdvisory({ text: "🌧 Active rainfall — avoid watering. Check field drainage to prevent root rot.", type: "warning" });
    else if (soonR) setAdvisory({ text: "⛈️ Rain approaching in hours. Postpone pesticide and fertilizer spraying.", type: "caution" });
    else if (wind > 5) setAdvisory({ text: "💨 High wind detected. Foliar spraying not advisable — drift risk high.", type: "caution" });
    else if (temp > 34) setAdvisory({ text: "🔥 Heat wave active. Irrigate early morning or after sunset to reduce evaporation.", type: "info" });
    else setAdvisory({ text: "✅ Optimal farm conditions. Ideal time for crop monitoring and maintenance.", type: "success" });
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const aiInsight = current ? (
    current.main.humidity > 70 ? "⚠️ High humidity. Delay fungicide spraying — poor absorption and drying conditions." :
      current.main.temp > 33 ? "🔥 Heat stress risk. Prioritize early morning irrigation to protect your crops." :
        current.wind.speed > 5 ? "💨 Active wind. Schedule foliar treatments after wind speed drops below 3 m/s." :
          "✅ Field conditions are favorable. Great time for irrigation and scouting."
  ) : "Analyzing live atmospheric data…";

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen p-5 pb-32"
      style={{ background: "linear-gradient(165deg, #020b18 0%, #030d1a 40%, #020810 100%)" }}>
      <div className="max-w-5xl mx-auto space-y-5 pt-4">
        <Skel h="h-10" className="w-48" />
        <Skel h="h-72" />
        <div className="flex gap-4">{[...Array(6)].map((_, i) => <Skel key={i} h="h-24" className="min-w-[110px]" />)}</div>
        <Skel h="h-52" />
        <div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <Skel key={i} h="h-40" />)}</div>
      </div>
    </div>
  );

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (error || !current) return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(165deg, #020b18, #030d1a, #020810)" }}>
      <Glass className="text-center max-w-sm">
        <div className="text-6xl mb-5">⛈️</div>
        <h2 className="text-xl font-black uppercase text-white mb-2">Weather Unavailable</h2>
        <p className="text-white/35 text-sm font-medium mb-6">{error || "Could not retrieve live data."}</p>
        <button onClick={load}
          className="w-full text-white py-3 rounded-2xl font-black uppercase text-sm transition"
          style={{ background: "linear-gradient(135deg, #059669, #0ea5e9)" }}>
          Reconnect
        </button>
      </Glass>
    </div>
  );

  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dewPoint = (current.main.temp - ((100 - current.main.humidity) / 5)).toFixed(1);

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden"
      style={{ background: "linear-gradient(165deg, #020b18 0%, #040e1c 35%, #020a14 65%, #01060e 100%)" }}>

      {/* ── Background depth particles ──────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {[...Array(18)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 4)}px`, height: `${2 + (i % 4)}px`,
              top: `${(i * 17 + 5) % 100}%`, left: `${(i * 23 + 8) % 100}%`,
              background: i % 3 === 0 ? "rgba(56,189,248,0.25)" : i % 3 === 1 ? "rgba(52,211,153,0.2)" : "rgba(167,139,250,0.15)"
            }}
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
        {/* Wide glow orbs in background */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-6 space-y-6">

        {/* 1. ADVISORY */}
        <motion.div {...fadeUp(0)}><AdvisoryBanner advisory={advisory} /></motion.div>

        {/* 2. HERO */}
        <motion.div {...fadeUp(0.07)}>
          <Glass className="relative overflow-hidden" style={{ padding: "2rem 2.25rem" }}>
            {/* Inner glow blobs */}
            <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full pointer-events-none opacity-[0.07]"
              style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none opacity-[0.05]"
              style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />
            <div className="relative">
              <WeatherHeader current={current} />
            </div>
          </Glass>
        </motion.div>

        {/* 3. METRICS STRIP */}
        <motion.div {...fadeUp(0.12)}>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {[
              { icon: "💧", label: "Humidity", value: `${current.main.humidity}%` },
              { icon: "💨", label: "Wind", value: `${current.wind.speed} m/s` },
              { icon: "⏲️", label: "Pressure", value: `${current.main.pressure} hPa` },
              { icon: "👁️", label: "Visibility", value: `${(current.visibility / 1000).toFixed(1)} km` },
              { icon: "❄️", label: "Dew Point", value: `${dewPoint}°C` },
              { icon: "🌅", label: "Sunrise", value: sunrise },
              { icon: "🌇", label: "Sunset", value: sunset },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.12 }}>
                <MetricChip {...m} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 4. FARM INTELLIGENCE */}
        <motion.div {...fadeUp(0.18)}><FarmInsightsPanel /></motion.div>

        {/* 5. CHART + AQI */}
        <motion.div {...fadeUp(0.22)} className="grid lg:grid-cols-5 gap-5">
          <Glass className="lg:col-span-3" style={{ padding: "1.75rem" }}>
            <Label>📈 Hourly Temperature</Label>
            <div className="h-52">
              <WeatherChart hourly={hourly} />
            </div>
          </Glass>
          <div className="lg:col-span-2">
            <AQICard aqi={aqi} />
          </div>
        </motion.div>

        {/* 6. AI INSIGHT */}
        <motion.div {...fadeUp(0.26)}>
          <div
            className="relative overflow-hidden px-7 py-6 rounded-[2rem]"
            style={{
              background: "rgba(5,12,24,0.96)",
              border: "1px solid rgba(52,211,153,0.18)",
              boxShadow: "0 0 60px rgba(16,185,129,0.06), inset 0 1px 0 rgba(255,255,255,0.04)"
            }}
          >
            {/* Gradient top line */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] rounded-t-[2rem]"
              style={{ background: "linear-gradient(90deg, #34d399, #38bdf8, #818cf8)" }} />
            <p className="text-[8px] font-black uppercase tracking-[0.35em] text-emerald-400 mb-3">🤖 AI Weather Intelligence</p>
            <p className="text-[15px] font-bold text-white/75 leading-relaxed">{aiInsight}</p>
          </div>
        </motion.div>

        {/* 7. HOURLY CARDS */}
        <motion.div {...fadeUp(0.3)}>
          <Label>🕐 Next 12 Hours</Label>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {hourly.map((h, i) => (
              <motion.div key={i}
                whileHover={{ scale: 1.1, y: -4, boxShadow: "0 12px 30px rgba(56,189,248,0.12)" }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i + 0.3 }}
                className="min-w-[88px] text-center flex-shrink-0 px-4 py-4"
                style={{ ...GLASS, borderRadius: "1.5rem" }}
              >
                <p className="text-[7px] font-black uppercase text-white/30 tracking-widest">
                  {new Date(h.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <img src={`https://openweathermap.org/img/wn/${h.weather[0].icon}.png`} className="w-11 mx-auto" alt="" />
                <p className="text-lg font-black text-white">{Math.round(h.main.temp)}°</p>
                <p className="text-[7px] font-bold text-blue-400 uppercase mt-0.5">{Math.round((h.pop ?? 0) * 100)}%🌧</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 8. WEEKLY FORECAST */}
        <motion.div {...fadeUp(0.34)}>
          <Label>📅 7-Day Forecast</Label>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {forecast.map((d, i) => (
              <motion.div key={i}
                whileHover={{ scale: 1.08, y: -4 }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i + 0.34 }}
                className="min-w-[105px] text-center flex-shrink-0 px-4 py-5"
                style={{ ...GLASS, borderRadius: "1.8rem" }}
              >
                <p className="text-[7px] font-black uppercase text-white/30 tracking-widest">
                  {new Date(d.dt * 1000).toLocaleDateString(undefined, { weekday: "short" })}
                </p>
                <img src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`} className="w-12 mx-auto" alt="" />
                <p className="text-xl font-black text-white">{Math.round(d.main.temp)}°</p>
                <p className="text-[6px] text-white/25 font-bold uppercase mt-1 capitalize leading-tight">
                  {d.weather[0].description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 9. SPRAY TIMELINE */}
        <motion.div {...fadeUp(0.38)}><SprayTimeline hourly={hourly} /></motion.div>

        {/* 10. BOTTOM GRID */}
        <motion.div {...fadeUp(0.42)}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "🌡️", label: "Min / Max", value: `${Math.round(current.main.temp_min)}° / ${Math.round(current.main.temp_max)}°` },
              { icon: "📊", label: "Cloud Cover", value: `${current.clouds.all}%` },
              { icon: "🌬", label: "Wind Dir.", value: `${current.wind.deg ?? "--"}°` },
              { icon: "❄️", label: "Dew Point", value: `${dewPoint}°C` },
              { icon: "🌅", label: "Day Length", value: `${Math.round((current.sys.sunset - current.sys.sunrise) / 3600)}h` },
              { icon: "☀️", label: "UV Index", value: "Moderate" },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.42 }}>
                <WeatherCard {...m} />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* FLOATING AI */}
      <AIChatAssistant current={current} />
    </div>
  );
}
