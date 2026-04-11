import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Slideshow from "../components/Slideshow";
import WelcomeSlide from "../components/WelcomeSlide";

const BACKDROP_IMAGES = [
  "https://images.unsplash.com/photo-1592982537447-6f2da6a0c0c7?auto=format&fit=crop&q=80&w=1200", // Farmer fields
  "https://images.unsplash.com/photo-1599813354924-aa94ecdcee89?auto=format&fit=crop&q=80&w=1200", // Green crops
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1200", // Technology/Drone view
  "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=1200"  // Landscape
];

export default function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const completeOnboarding = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    navigate("/");
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else completeOnboarding();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-gray-900 text-white">
      {/* Background Cinematic Module */}
      <Slideshow images={BACKDROP_IMAGES} interval={4500} />

      {/* Static Top Decor (Optional padding anchor) */}
      <div className="relative z-20 w-full p-6 flex justify-end">
        <button
          onClick={completeOnboarding}
          className="text-sm font-semibold uppercase tracking-widest text-white/50 hover:text-white transition"
        >
          {t("welcome.skip", "Skip")}
        </button>
      </div>

      {/* Main Content Arena */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">

          {step === 0 && (
            <WelcomeSlide key="screen1">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl mb-6 shadow-inner"
              >
                🌱
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-xl">
                {t("welcome.title", "Welcome to AgriSat")}
              </h1>
              <p className="text-xl text-green-300 font-medium drop-shadow-md">
                {t("welcome.subtitle", "Your smart farming partner")}
              </p>
            </WelcomeSlide>
          )}

          {step === 1 && (
            <WelcomeSlide key="screen2">
              <h2 className="text-3xl font-bold mb-8 drop-shadow-lg">
                {t("welcome.what_it_does", "Empowering Your Farm")}
              </h2>
              <div className="space-y-4 w-full">
                {[
                  { icon: "🦠", text: t("welcome.feature_1", "Detect crop diseases instantly") },
                  { icon: "📈", text: t("welcome.feature_2", "Track real-time market prices") },
                  { icon: "⛅", text: t("welcome.feature_3", "Get smart climate insights") },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-lg"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="font-semibold text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </WelcomeSlide>
          )}

          {step === 2 && (
            <WelcomeSlide key="screen3">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="text-7xl mb-6 drop-shadow-2xl"
              >
                🧠
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 drop-shadow-lg text-emerald-400">
                {t("welcome.ai_power", "Powered by AI")}
              </h2>
              <p className="text-lg text-gray-200 mb-2">
                {t("welcome.ai_desc_1", "AgriSat analyzes your crops in seconds via satellite and camera.")}
              </p>
              <p className="text-lg text-gray-200 font-bold">
                {t("welcome.ai_desc_2", "Smart prediction & instant actionable advice.")}
              </p>
            </WelcomeSlide>
          )}

          {step === 3 && (
            <WelcomeSlide key="screen4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-700/40 border border-green-400/30 backdrop-blur-md p-6 rounded-3xl flex flex-col items-center">
                  <span className="text-4xl mb-3">📈</span>
                  <span className="font-bold text-center">{t("welcome.benefit_1", "Increase Profit")}</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-700/40 border border-yellow-400/30 backdrop-blur-md p-6 rounded-3xl flex flex-col items-center">
                  <span className="text-4xl mb-3">🌾</span>
                  <span className="font-bold text-center">{t("welcome.benefit_2", "Reduce Loss")}</span>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-700/40 border border-blue-400/30 backdrop-blur-md p-6 rounded-3xl col-span-2 flex flex-col items-center">
                  <span className="text-4xl mb-3">💡</span>
                  <span className="font-bold text-center">{t("welcome.benefit_3", "Make smarter decisions daily")}</span>
                </div>
              </div>
            </WelcomeSlide>
          )}

          {step === 4 && (
            <WelcomeSlide key="screen5">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                className="text-7xl mb-6 drop-shadow-2xl"
              >
                🌿
              </motion.div>
              <h1 className="text-4xl font-extrabold mb-8 drop-shadow-lg text-green-400">
                {t("welcome.final", "Let’s grow together")}
              </h1>

              <button
                onClick={completeOnboarding}
                className="w-full bg-green-500 hover:bg-green-400 text-gray-900 text-xl font-bold py-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] transition transform hover:scale-105"
              >
                {t("welcome.cta", "Start Farming Smart")}
              </button>
            </WelcomeSlide>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation & Dots */}
      <div className="relative z-20 w-full p-6 flex flex-col items-center pb-10">
        <div className="flex gap-3 mb-8">
          {[0, 1, 2, 3, 4].map((dot) => (
            <div
              key={dot}
              className={`h-2 rounded-full transition-all duration-500 ${step === dot ? "w-8 bg-green-400" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>

        {step < 4 && (
          <button
            onClick={nextStep}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/40 px-10 py-3 rounded-full font-bold text-lg transition tracking-wide shadow-lg"
          >
            {t("welcome.next", "Next")} →
          </button>
        )}
      </div>

    </div>
  );
}
