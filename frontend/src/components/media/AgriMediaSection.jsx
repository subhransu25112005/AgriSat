import React from "react";
import { motion } from "framer-motion";
import VideoCarousel from "./VideoCarousel";
import NewsGrid from "./NewsGrid";

export default function AgriMediaSection() {
  return (
    <div className="w-full mt-10 mb-8 space-y-12">
      
      {/* ── 1. TRENDING AGRI SHORTS ─────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              Agri Shorts <span className="text-2xl pt-1">🎥</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Top performing videos this week</p>
          </div>
          {/* AI Smart Touch Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full"
          >
            <span className="text-orange-600 dark:text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <span className="animate-pulse w-1.5 h-1.5 bg-orange-600 dark:bg-orange-500 rounded-full inline-block" />
              Trending Now
            </span>
          </motion.div>
        </div>
        
        <VideoCarousel />
      </section>


      {/* ── 2. LIVE AGRICULTURE NEWS ──────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              Live Updates <span className="text-2xl pt-1">📰</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time agricultural news and alerts</p>
          </div>
          {/* AI Smart Touch Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full">
            <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              ⚠️ Important for farmers
            </span>
          </div>
        </div>

        <NewsGrid />
      </section>

    </div>
  );
}
