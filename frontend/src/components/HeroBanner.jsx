import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Plane } from "lucide-react";

const quotes = [
  "Empowering Farmers with Intelligence.",
  "From Soil to Satellite — Smarter Farming Begins Here.",
  "Harnessing the Skies for Earth's Bounty.",
  "Precision Agriculture for a Sustainable Future."
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[45vh] min-h-[300px] overflow-hidden rounded-3xl mb-8 flex items-center justify-center bg-darkForest glass-card border-none shadow-neon">
      
      {/* Background Deep Glows */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0F7A3A]/20 via-[#0B130D] to-[#00ff88]/10 opacity-70"></div>
      
      {/* Floating Particles/Elements */}
      <div className="absolute grid grid-cols-2 gap-8 top-10 left-10 opacity-10 blur-sm pointer-events-none">
         <Leaf size={120} className="text-neonGreen transform rotate-45 animate-[particleDrift_20s_infinite]" />
      </div>
      <div className="absolute right-20 bottom-10 opacity-10 blur-sm pointer-events-none">
         <Plane size={80} className="text-brandAccent transform -rotate-12 animate-[particleDrift_15s_infinite]" />
      </div>

      <div className="relative z-10 text-center px-4 md:px-10 max-w-4xl mx-auto flex flex-col items-center">
        
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="w-16 h-16 bg-gradient-to-br from-brand to-neonGreen rounded-full p-[2px] mb-6 shadow-neonStrong"
        >
           <div className="w-full h-full bg-earthyBlack rounded-full flex items-center justify-center">
             <Leaf className="text-neonGreen" size={28} />
           </div>
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-grayText to-white tracking-tight mb-4 drop-shadow-lg">
          AgriSat Intelligence
        </h1>

        <div className="h-20 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-2xl text-neonGreen font-medium text-center tracking-wide"
              style={{ textShadow: "0 0 10px rgba(0,255,136,0.3)" }}
            >
              "{quotes[index]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Bottom fade line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neonGreen to-transparent opacity-40"></div>
    </div>
  );
}
