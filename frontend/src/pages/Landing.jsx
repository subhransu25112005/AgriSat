import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Slideshow from "../components/Slideshow";

const BACKDROP_IMAGES = [
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=75&w=1200",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=75&w=1200",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=75&w=1200",
  "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=75&w=1200",
];

const FEATURES = [
  { icon: "🦠", title: "AI Crop Disease Detection", desc: "Upload a leaf photo and get instant AI diagnosis with treatment advice.", path: "/diagnosis" },
  { icon: "📈", title: "Live Mandi Price Intelligence", desc: "Real-time market rates and price trends across all Indian states.", path: "/market-prices" },
  { icon: "🛰️", title: "NDVI Satellite Monitoring", desc: "Track field health from space with weekly vegetation index reports.", path: "/ndvi" },
  { icon: "⛅", title: "Smart Weather Forecasting", desc: "Hyper-local weather updates with specific spray and sowing advice.", path: "/weather" },
  { icon: "🏛️", title: "Government Scheme Finder", desc: "Stay updated on the latest subsidies and agricultural benefits.", path: "/govt-schemes" },
  { icon: "🧪", title: "Fertilizer Recommendation", desc: "Optimize nutrient application based on crop type and soil data.", path: "/fertilizer" },
  { icon: "⚠️", title: "Pest & Disease Alerts", desc: "Community alerts when local pests are detected near your farm.", path: "/pest-alerts" },
  { icon: "🤖", title: "AI Farming Assistant", desc: "24/7 agricultural expert chatbot for all your farming queries.", path: "/chat" },
  { icon: "💰", title: "Farm Profit Calculator", desc: "Track expenses and predict income for better financial planning.", path: "/calculator" },
  { icon: "🏗️", title: "Storage & Sell Decision", desc: "Data-driven advice on when to store vs. when to sell crops.", path: "/decision" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gray-950 text-white">
      {/* Cinematic Background */}
      <Slideshow images={BACKDROP_IMAGES} interval={5000} />

      {/* Hero Section */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Nav */}
        <div className="flex items-center justify-between px-6 pt-8 pb-4">
          <motion.img 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            src="/logo.svg" alt="AgriSat" className="h-10 drop-shadow-md" />
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/login")}
            className="text-sm font-bold border-2 border-green-500/30 rounded-full px-6 py-2 hover:bg-green-500 hover:text-gray-900 transition-all backdrop-blur-md"
          >
            {t("landing.sign_in", "Sign In")}
          </motion.button>
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
               animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="text-7xl mb-6 blur-[1px]">🌾</motion.div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight uppercase">
              {t("landing.title", "Precision Farming")}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {t("landing.title2", "Revolutionized")}
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-medium">
              {t("landing.subtitle", "AgriSat combines AI and Satellite intelligence to help Indian farmers grow more, earn more, and save more.")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34,197,94,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bg-green-500 text-gray-950 text-xl font-black px-12 py-5 rounded-2xl transition shadow-xl"
              >
                {t("landing.cta", "Get Started Free")} →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white text-xl font-bold px-12 py-5 rounded-2xl transition"
              >
                {t("landing.learn_more", "How it Works")}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-black/60 backdrop-blur-2xl border-t border-white/5 py-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
            {[
              { val: "50,000+", lab: "Active Farmers" },
              { val: "98.5%", lab: "AI Diagnosis Accuracy" },
              { val: "1.2M", lab: "Acres Monitored" },
              { val: "15+", lab: "Indian States" },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <p className="text-4xl font-black text-green-400 group-hover:scale-110 transition-transform">{s.val}</p>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-2">{s.lab}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Features Grid */}
      <div className="relative z-20 bg-gray-950 px-6 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-green-500 font-black tracking-widest uppercase text-sm">Our Ecosystem</span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6 uppercase">
            Powerful AI Tools for <span className="text-green-500">Smart Farmers</span>
          </h2>
          <div className="h-2 w-32 bg-green-500 mx-auto rounded-full mb-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1400px] mx-auto">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -15,
                boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.3)",
                borderColor: "rgba(34, 197, 94, 0.4)"
              }}
              onClick={() => navigate("/login")}
              className="p-8 rounded-[2rem] border-2 border-white/5 bg-white/5 backdrop-blur-sm cursor-pointer transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-5xl mb-8 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                {f.icon}
              </div>
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight group-hover:text-green-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="relative z-20 bg-green-950/20 px-6 py-24 text-center border-y border-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-6xl mb-8">👨‍🌾</div>
          <blockquote className="text-2xl md:text-4xl font-bold text-gray-200 max-w-4xl mx-auto mb-8 tracking-tight leading-snug">
            "{t("landing.quote", "AgriSat helped me detect leaf blight early and save my entire wheat harvest. The profit calculator changed how I track my expenses.")}"
          </blockquote>
          <p className="text-lg text-green-500 font-black uppercase tracking-widest">{t("landing.quote_author", "— Ramlal Verma, Madhya Pradesh")}</p>
        </motion.div>
      </div>

      {/* Final CTA */}
      <div className="relative z-20 bg-gradient-to-t from-green-900/40 to-transparent px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase">
            Start protecting your crops today
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium">
            {t("landing.final_sub", "Join 50,000+ smart farmers across India. Start your high-yield journey for free.")}
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(34,197,94,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="bg-green-500 text-gray-950 font-black text-2xl px-16 py-6 rounded-3xl transition shadow-2xl uppercase"
          >
            🌱 {t("landing.final_cta", "Join AgriSat Free")}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
