import { motion, AnimatePresence } from "framer-motion";

const VARIANTS = {
  warning: {
    gradient: "linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #f97316 100%)",
    glow: "rgba(239,68,68,0.35)",
    icon: "🚨", label: "Risk Alert"
  },
  caution: {
    gradient: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #fbbf24 100%)",
    glow: "rgba(217,119,6,0.35)",
    icon: "⚠️", label: "Farm Caution"
  },
  info: {
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #38bdf8 100%)",
    glow: "rgba(59,130,246,0.35)",
    icon: "💧", label: "Advisory"
  },
  success: {
    gradient: "linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%)",
    glow: "rgba(16,185,129,0.35)",
    icon: "✅", label: "Optimal"
  },
  neutral: {
    gradient: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
    glow: "rgba(71,85,105,0.25)",
    icon: "🌤️", label: "Monitoring"
  }
};

export default function AdvisoryBanner({ advisory = { text: "Loading advisory...", type: "neutral" } }) {
  const v = VARIANTS[advisory.type] ?? VARIANTS.neutral;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={advisory.type}
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[1.6rem] px-6 py-5"
        style={{
          background: v.gradient,
          boxShadow: `0 8px 40px ${v.glow}, inset 0 1px 0 rgba(255,255,255,0.12)`
        }}
      >
        {/* Animated shimmer streak */}
        <motion.div
          className="absolute inset-y-0 w-24 bg-white/10 -skew-x-12 pointer-events-none"
          animate={{ x: ["-100%", "600%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
        />

        {/* Pulse dot */}
        <span className="absolute top-4 right-5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white/80" />
        </span>

        <div className="relative flex items-center gap-3">
          <span className="text-xl flex-shrink-0">{v.icon}</span>
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.35em] text-white/60 mb-0.5">{v.label}</p>
            <p className="text-sm font-bold text-white leading-snug">{advisory.text}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
