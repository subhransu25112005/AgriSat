import { motion } from "framer-motion";

export default function WeatherCard({ icon, label, value, sublabel, accent = "emerald" }) {
  const glowMap = {
    emerald: "rgba(16,185,129,0.25)",
    blue:    "rgba(56,189,248,0.25)",
    orange:  "rgba(251,146,60,0.25)",
    red:     "rgba(248,113,113,0.25)",
    purple:  "rgba(167,139,250,0.25)"
  };
  const glow = glowMap[accent] ?? glowMap.emerald;

  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        y: -4,
        boxShadow: `0 16px 48px ${glow}, 0 0 0 1px rgba(255,255,255,0.08)`
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden flex flex-col gap-2 p-5 rounded-[1.6rem] cursor-default"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.3)"
      }}
    >
      {/* Subtle top sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <span className="text-2xl leading-none">{icon}</span>
      <p className="text-[8px] font-black uppercase tracking-[0.28em] text-white/35 mt-0.5">{label}</p>
      <p className="text-xl font-black text-white leading-none">{value}</p>
      {sublabel && (
        <p className="text-[8px] font-bold uppercase tracking-wide text-white/30">{sublabel}</p>
      )}
    </motion.div>
  );
}
