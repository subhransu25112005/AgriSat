import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/api";

const LAT = 20.2961;
const LON = 85.8245;

// ── Circular Progress Ring ────────────────────────────────────────────────────
function Ring({ value = 0, max = 10, size = 80, stroke = 7, color = "#34d399" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const offset = circ * (1 - pct);
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

// ── Risk Badge ────────────────────────────────────────────────────────────────
function RiskBadge({ risk }) {
  const cfg = {
    Low:    { color: "#34d399", glow: "rgba(52,211,153,0.3)",  bg: "rgba(52,211,153,0.1)"  },
    Medium: { color: "#fbbf24", glow: "rgba(251,191,36,0.3)",  bg: "rgba(251,191,36,0.1)"  },
    High:   { color: "#f87171", glow: "rgba(248,113,113,0.3)", bg: "rgba(248,113,113,0.1)" }
  }[risk] ?? { color: "#94a3b8", glow: "transparent", bg: "rgba(148,163,184,0.1)" };

  return (
    <div className="flex items-center gap-3 mt-3">
      <div
        className="text-2xl font-black"
        style={{ color: cfg.color, textShadow: `0 0 14px ${cfg.glow}` }}
      >{risk}</div>
      <span
        className="text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full"
        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
      >{risk} Risk</span>
    </div>
  );
}

// ── Gradient Border Card ───────────────────────────────────────────────────────
function GCard({ gradient = "#34d399, #14b8a6", children, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.025, y: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`relative rounded-[1.8rem] p-[1px] ${className}`}
      style={{ background: `linear-gradient(135deg, ${gradient})` }}
    >
      <div
        className="rounded-[1.75rem] h-full p-5"
        style={{
          background: "rgba(5,10,20,0.9)",
          backdropFilter: "blur(20px)"
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function FarmInsightsPanel() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const r = await api.get("/insights/farm", { params: { lat: LAT, lon: LON } });
        setData(r.data);
      } catch (e) { setData(null); }
      finally { setLoading(false); }
    };
    fetch();
    const t = setInterval(fetch, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  // Section label
  const SectionLabel = () => (
    <p className="text-[8px] font-black uppercase tracking-[0.35em] text-emerald-400 mb-4">
      🌾 Agricultural Intelligence
    </p>
  );

  if (loading) return (
    <>
      <SectionLabel />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 rounded-[1.8rem] animate-pulse"
            style={{ background: "rgba(255,255,255,0.04)" }} />
        ))}
      </div>
    </>
  );

  if (!data) return (
    <>
      <SectionLabel />
      <div className="rounded-[1.8rem] p-6 text-center text-white/30 text-xs font-bold uppercase tracking-widest"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        Farm Intelligence Unavailable
      </div>
    </>
  );

  const score    = data.health_score ?? 0;
  const health   = data.health_status ?? data.health ?? "Unknown";
  const risk     = data.risk ?? "Low";
  const moisture = data.moisture ?? "--";
  const mPct     = data.moisture_pct ?? 50;
  const rec      = data.recommendation ?? "Stable conditions";
  const ndvi     = data.ndvi != null ? data.ndvi.toFixed(3) : null;

  const healthGradient  = score >= 7 ? "#34d399, #059669" : score >= 4 ? "#fbbf24, #d97706" : "#f87171, #dc2626";
  const moistureGradient= mPct >= 60 ? "#38bdf8, #0ea5e9" : mPct >= 35 ? "#fbbf24, #d97706" : "#f97316, #dc2626";
  const riskGradient    = risk === "Low" ? "#34d399, #059669" : risk === "Medium" ? "#fbbf24, #d97706" : "#f87171, #dc2626";
  const ringColor       = score >= 7 ? "#34d399"  : score >= 4 ? "#fbbf24"  : "#f87171";
  const mBarColor       = mPct >= 60 ? "#38bdf8"  : mPct >= 35 ? "#fbbf24"  : "#f97316";

  return (
    <div>
      <SectionLabel />
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={{ show: { transition: { staggerChildren: 0.08 }} }}
        initial="hidden"
        animate="show"
      >
        {/* Crop Health — Circular ring */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <GCard gradient={healthGradient}>
            <p className="text-[7px] font-black uppercase tracking-[0.28em] text-white/35 mb-3">🌱 Crop Health</p>
            <div className="relative flex items-center justify-center">
              <Ring value={score} max={10} color={ringColor} />
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black" style={{ color: ringColor }}>{score}</span>
                <span className="text-[7px] text-white/30 font-bold uppercase">/10</span>
              </div>
            </div>
            <p className="text-[9px] font-black uppercase text-center mt-2" style={{ color: ringColor }}>{health}</p>
            {ndvi && <p className="text-[7px] text-white/25 font-bold uppercase text-center mt-1">NDVI {ndvi}</p>}
          </GCard>
        </motion.div>

        {/* Risk Level */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <GCard gradient={riskGradient}>
            <p className="text-[7px] font-black uppercase tracking-[0.28em] text-white/35 mb-2">⚠️ Risk Level</p>
            <RiskBadge risk={risk} />
            <p className="text-[8px] text-white/30 font-bold uppercase mt-4 leading-relaxed">
              Thermal + moisture<br />stress assessment
            </p>
          </GCard>
        </motion.div>

        {/* Moisture */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <GCard gradient={moistureGradient}>
            <p className="text-[7px] font-black uppercase tracking-[0.28em] text-white/35 mb-3">💧 Moisture</p>
            <p className="text-3xl font-black" style={{ color: mBarColor }}>{moisture}</p>
            {/* Gradient progress bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mPct}%` }}
                transition={{ duration: 1.3, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${moistureGradient})`, boxShadow: `0 0 8px ${mBarColor}60` }}
              />
            </div>
            <p className="text-[7px] text-white/25 font-bold uppercase mt-2">{mPct}% saturation</p>
          </GCard>
        </motion.div>

        {/* AI Recommendation */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <GCard gradient="#34d399, #0ea5e9">
            <p className="text-[7px] font-black uppercase tracking-[0.28em] text-emerald-400 mb-3">🤖 AI Action</p>
            <p className="text-[11px] font-bold text-white/75 leading-relaxed">{rec}</p>
            {/* Animated shimmer */}
            <motion.div
              className="absolute inset-0 rounded-[1.75rem] pointer-events-none overflow-hidden"
              style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)" }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            />
          </GCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
