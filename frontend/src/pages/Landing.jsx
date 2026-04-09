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
  { icon: "🦠", title: "Instant Crop Diagnosis", desc: "Upload a photo and get AI disease analysis in seconds." },
  { icon: "📈", title: "Live Market Prices", desc: "Real-time mandi rates to help you sell at the right moment." },
  { icon: "🛰️", title: "Satellite NDVI Monitoring", desc: "Track your field health from space, every week." },
  { icon: "⛅", title: "Smart Weather Alerts", desc: "Precision forecasting with actionable spray timing advice." },
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gray-950 text-white">
      {/* Cinematic Background */}
      <Slideshow images={BACKDROP_IMAGES} interval={4000} />

      {/* Hero Section */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Nav */}
        <div className="flex items-center justify-between px-6 pt-8 pb-4">
          <img src="/glogo.png" alt="AgriSat" className="h-9 drop-shadow-md" />
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold border border-white/30 rounded-full px-5 py-2 hover:bg-white/10 transition backdrop-blur-sm"
          >
            {t("landing.sign_in", "Sign In")}
          </button>
        </div>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl mb-4 drop-shadow-2xl">🌾</div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-xl">
              {t("landing.title", "Smart Farming")}
              <span className="block text-green-400">{t("landing.title2", "Starts Here")}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto mb-8 drop-shadow">
              {t("landing.subtitle", "AI-powered crop health, weather intelligence, and market insights — built for Indian farmers.")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                className="bg-green-500 hover:bg-green-400 text-gray-900 text-lg font-bold px-8 py-4 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.35)] transition"
              >
                {t("landing.cta", "Get Started Free")} →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white text-lg font-semibold px-8 py-4 rounded-full transition"
              >
                {t("landing.learn_more", "Learn More")}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-black/40 backdrop-blur-md border-t border-white/10 px-6 py-4"
        >
          <div className="flex justify-around max-w-lg mx-auto">
            {[
              { value: "50K+", label: t("landing.stat1", "Farmers") },
              { value: "98%", label: t("landing.stat2", "Accuracy") },
              { value: "15+", label: t("landing.stat3", "States") },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-extrabold text-green-400">{s.value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-20 bg-gray-950 px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-2">
          {t("landing.features_title", "Everything your farm needs")}
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          {t("landing.features_sub", "Powerful AI tools tailored for Indian agriculture")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              onClick={() => setActiveFeature(i)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeFeature === i
                  ? "bg-green-900/40 border-green-500"
                  : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Farmers Testimonial / Emotional Section */}
      <div className="relative z-20 bg-gradient-to-b from-gray-950 to-green-950 px-6 py-12 text-center">
        <div className="text-5xl mb-4">👨‍🌾</div>
        <blockquote className="text-xl font-semibold text-gray-200 max-w-sm mx-auto mb-4 italic">
          "{t("landing.quote", "AgriSat helped me detect leaf blight early and save my entire wheat harvest.")}"
        </blockquote>
        <p className="text-sm text-gray-400">{t("landing.quote_author", "— Ramlal Verma, Madhya Pradesh")}</p>
      </div>

      {/* Final CTA */}
      <div className="relative z-20 bg-green-900/40 backdrop-blur-sm border-t border-green-700/30 px-6 py-10 text-center">
        <h2 className="text-2xl font-extrabold mb-3">
          {t("landing.final_title", "Start protecting your crops today")}
        </h2>
        <p className="text-gray-300 mb-6 text-sm">
          {t("landing.final_sub", "Join thousands of smart farmers. It's free.")}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/login")}
          className="bg-green-500 hover:bg-green-400 text-gray-900 font-bold text-lg px-10 py-4 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] transition"
        >
          🌱 {t("landing.final_cta", "Join AgriSat Free")}
        </motion.button>
      </div>
    </div>
  );
}
