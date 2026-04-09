import { motion } from "framer-motion";

export default function SprayTimeline({ hourly = [] }) {
  if (!hourly.length) return null;

  const slots = hourly.slice(0, 6).map(h => {
    const temp = h.main.temp;
    const wind = h.wind?.speed ?? 0;
    const rain = h.pop ?? 0;
    const isOptimal  = temp >= 18 && temp <= 28 && wind < 4 && rain < 0.3;
    const isModerate = !isOptimal && temp <= 32 && rain < 0.5;
    const status     = isOptimal ? "Optimal" : isModerate ? "Moderate" : "Avoid";
    const barPct     = isOptimal ? 95 : isModerate ? 52 : 12;
    return {
      time: new Date(h.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temp: Math.round(temp), wind: wind.toFixed(1), rain: Math.round(rain * 100),
      status, barPct
    };
  });

  const cfg = {
    Optimal:  { grad: "#34d399, #059669", glow: "rgba(52,211,153,0.35)",  label: "safe",  icon: "✅", textColor: "#34d399", border: "rgba(52,211,153,0.2)"  },
    Moderate: { grad: "#fbbf24, #d97706", glow: "rgba(251,191,36,0.3)",   label: "caution",icon: "⚠️", textColor: "#fbbf24", border: "rgba(251,191,36,0.2)"  },
    Avoid:    { grad: "#f87171, #dc2626", glow: "rgba(248,113,113,0.35)", label: "risky", icon: "❌", textColor: "#f87171", border: "rgba(248,113,113,0.2)" }
  };

  return (
    <div>
      <p className="text-[8px] font-black uppercase tracking-[0.35em] text-blue-400 mb-4">
        🚿 Spraying Window
      </p>
      <div className="space-y-3">
        {slots.map((s, i) => {
          const c = cfg[s.status];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i, duration: 0.4 }}
              className="rounded-[1.4rem] px-5 py-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${c.border}`,
                boxShadow: s.status === "Optimal" ? `0 0 24px ${c.glow}` : "none"
              }}
            >
              {/* Time + Status */}
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-black text-white text-sm">{s.time}</span>
                <span
                  className="text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5"
                  style={{ color: c.textColor }}
                >
                  {c.icon} {s.label}
                </span>
              </div>

              {/* Gradient progress bar */}
              <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden mb-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.barPct}%` }}
                  transition={{ duration: 1.0, delay: 0.07 * i, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${c.grad})`,
                    boxShadow: `0 0 8px ${c.glow}`
                  }}
                />
              </div>

              {/* Sub-metrics */}
              <div className="flex gap-4 text-[8px] font-bold uppercase tracking-wide"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                <span>🌡️ {s.temp}°C</span>
                <span>💨 {s.wind} m/s</span>
                <span>🌧 {s.rain}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
