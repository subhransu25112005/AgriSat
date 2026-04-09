import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoModal({ videoId, onClose }) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Dark Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm sm:max-w-md md:max-w-3xl aspect-[9/16] md:aspect-video rounded-[2rem] overflow-hidden bg-black shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
          >
            ✕
          </button>

          {/* YouTube Player */}
          {videoId ? (
            <iframe
              className="w-full h-full object-cover"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-4">
               <span className="text-4xl text-gray-700">▶</span>
               <p className="font-bold uppercase tracking-widest text-xs">Video Loading...</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
