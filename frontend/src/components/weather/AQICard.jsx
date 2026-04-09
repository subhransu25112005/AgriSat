import { motion } from "framer-motion";

/**
 * AQICard — displays Air Quality Index with color-coded status.
 * Props: aqi = OpenWeatherMap air_pollution list[0]
 */

const AQI_LEVELS = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
const AQI_COLORS = [
  "",
  "text-green-600 dark:text-green-400",
  "text-lime-600 dark:text-lime-400",
  "text-yellow-600 dark:text-yellow-400",
  "text-orange-600 dark:text-orange-400",
  "text-red-600 dark:text-red-400"
];
const AQI_BG = [
  "",
  "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800",
  "bg-lime-50 dark:bg-lime-900/10 border-lime-100 dark:border-lime-800",
  "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-800",
  "bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800",
  "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800"
];

export default function AQICard({ aqi }) {
  if (!aqi) return null;

  const idx     = aqi.main?.aqi ?? 1;
  const label   = AQI_LEVELS[idx] ?? "Unknown";
  const color   = AQI_COLORS[idx] ?? AQI_COLORS[1];
  const bgClass = AQI_BG[idx]    ?? AQI_BG[1];
  const comps   = aqi.components ?? {};

  // Progress bar: aqi 1→5 maps to 20%→100%
  const pct = ((idx - 1) / 4) * 100;
  const barColor = [
    "", "bg-green-500", "bg-lime-400", "bg-yellow-400", "bg-orange-500", "bg-red-500"
  ][idx] ?? "bg-green-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/70 dark:bg-white/5 backdrop-blur-xl border ${bgClass}
                  p-6 rounded-[2rem] shadow-lg`}
    >
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4">
        🌬️ Air Quality Index
      </p>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className={`text-4xl font-black leading-none ${color}`}>{label}</p>
          <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">AQI Level {idx} of 5</p>
        </div>
        <p className={`text-7xl font-black opacity-15 ${color}`}>{idx}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>

      {/* Pollutants */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "PM2.5", val: comps.pm2_5 },
          { label: "PM10",  val: comps.pm10  },
          { label: "NO₂",   val: comps.no2   },
          { label: "CO",    val: comps.co    },
          { label: "O₃",    val: comps.o3    },
          { label: "SO₂",   val: comps.so2   },
        ].map(p => (
          <div key={p.label} className="text-center">
            <p className="text-[9px] font-black uppercase text-gray-400">{p.label}</p>
            <p className="text-sm font-black text-gray-700 dark:text-gray-200 mt-1">
              {p.val != null ? p.val.toFixed(1) : "--"}
              <span className="text-[8px] font-bold text-gray-400 ml-0.5">µg</span>
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
