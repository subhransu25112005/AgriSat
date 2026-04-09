import { motion } from "framer-motion";

export default function WeatherHeader({ current }) {
  if (!current) return null;
  const temp      = Math.round(current.main.temp);
  const feelsLike = Math.round(current.main.feels_like);
  const desc      = current.weather[0].description;
  const icon      = current.weather[0].icon;
  const city      = current.name;
  const country   = current.sys.country;

  // Temp-reactive gradient glow colour
  const glowColor =
    temp > 35 ? "255,120,60" :
    temp > 25 ? "255,190,60" :
    temp > 15 ? "60,220,150" :
               "60,150,255";

  return (
    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

      {/* ── Radial glow behind temperature ── */}
      <div
        className="absolute -top-12 -left-12 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${glowColor},0.18) 0%, transparent 70%)`,
          filter: "blur(2px)"
        }}
      />

      {/* ── Left: location + huge temp + desc ── */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Location pill */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-blue-400/80">📍</span>
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-blue-400/80">
            {city}, {country}
          </span>
        </div>

        {/* Giant temperature */}
        <motion.div
          key={temp}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-[7.5rem] sm:text-[9.5rem] font-black leading-none tracking-tighter"
          style={{
            background: `linear-gradient(135deg, rgba(${glowColor},1) 0%, rgba(255,255,255,0.85) 60%, rgba(${glowColor},0.7) 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none"
          }}
        >
          {temp}°
        </motion.div>

        {/* Condition */}
        <p className="text-white/70 font-bold capitalize text-xl mt-2 tracking-wide">
          {desc}
        </p>

        {/* Feels like */}
        <p className="text-white/35 text-[11px] font-black uppercase tracking-[0.25em] mt-1.5">
          Feels like {feelsLike}°C
          <span className="mx-2 opacity-40">·</span>
          Updated just now
        </p>
      </motion.div>

      {/* ── Right: floating animated icon ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 flex-shrink-0"
      >
        {/* Icon glow halo */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-40 scale-110"
          style={{ background: `radial-gradient(circle, rgba(${glowColor},0.6), transparent)` }}
        />
        <motion.img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={desc}
          className="w-32 sm:w-44 drop-shadow-2xl relative z-10"
          animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
