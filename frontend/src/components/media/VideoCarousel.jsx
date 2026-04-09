import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAgriVideos } from "../../services/agriMediaService";
import VideoModal from "./VideoModal";

export default function VideoCarousel() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getAgriVideos();
        setVideos(data);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="min-w-[140px] md:min-w-[180px] aspect-[9/16] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="w-full p-6 text-center bg-white/5 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800">
        <span className="text-3xl mb-2 block text-gray-400">🎥</span>
        <p className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-xs">Live Shorts Unavailable</p>
        <p className="text-xs text-gray-500 mt-1">Please connect your VITE_YOUTUBE_API_KEY</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6">
        {videos.map((video, idx) => (
          <motion.div
            key={video.videoId}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveVideo(video.videoId)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group cursor-pointer relative min-w-[150px] md:min-w-[200px] aspect-[9/16] snap-center flex-shrink-0 rounded-[1.8rem] overflow-hidden shadow-lg border border-white/10"
          >
            {/* Thumbnail Background */}
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />

            {/* Play Button Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 shadow-xl border border-white/30">
              <span className="text-white ml-1 text-lg">▶</span>
            </div>

            {/* Meta Content */}
            <div className="absolute bottom-0 inset-x-0 p-4">
              <h4 className="text-white font-bold text-sm leading-snug line-clamp-2 md:text-md mb-1 drop-shadow-md">
                {video.title}
              </h4>
              <p className="text-gray-300 text-[10px] font-semibold uppercase tracking-wider truncate">
                {video.channel}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {activeVideo && (
        <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
