import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAgriNews } from "../../services/agriMediaService";

export default function NewsGrid() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAgriNews();
        setNews(data);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchNews();

    // Auto-refresh every 5 minutes (300000 ms)
    const intervalId = setInterval(fetchNews, 300000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-white/5 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800">
        <span className="text-3xl mb-2 block text-gray-400">📰</span>
        <p className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-xs">Live agriculture news unavailable</p>
        <p className="text-xs text-gray-500 mt-1">Please configure your VITE_GNEWS_API_KEY</p>
      </div>
    );
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    return diffInHours > 0 ? `${diffInHours}h ago` : "Just now";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {news.map((item, idx) => (
        <motion.a
          key={idx}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02, y: -4, boxShadow: "0 10px 40px rgba(16,185,129,0.15)" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="flex flex-col bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-[1.4rem] overflow-hidden border border-gray-100 dark:border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm group"
        >
          {/* Subtle top sheen */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Image Thumbnail */}
          {item.image && (
            <div className="w-full h-40 overflow-hidden relative bg-black">
              <img
                src={item?.image}
                alt={item?.title}
                loading="lazy"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/1e293b/10b981?text=News+Unavailable' }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
            </div>
          )}

          {/* Content Block */}
          <div className="p-4 flex flex-col flex-1 justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-md line-clamp-2 leading-snug mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 md:line-clamp-3 mb-3">
                {item.description}
              </p>
            </div>

            {/* Meta Footer */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-500 mt-2">
              <span className="truncate max-w-[60%]">{item.source}</span>
              <span className="flex-shrink-0 text-emerald-500/80">{formatTime(item.publishedAt)}</span>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
