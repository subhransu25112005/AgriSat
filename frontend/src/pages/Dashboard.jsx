import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Camera,
  FileText,
  Pill,
  Cloud,
  Map,
  Activity,
  List,
  Bug,
  Sprout,
  Bell,
  LineChart,
  Landmark,
  BookOpen,
  Users,
  PlusCircle
} from "lucide-react";

import WeatherCard from "../components/Cards/WeatherCard";
import FarmCard from "../components/FarmCard";
import AgriMediaSection from "../components/media/AgriMediaSection";
import HeroBanner from "../components/HeroBanner";
import PageWrapper from "../components/PageWrapper";
import api from "../api/api";

export default function Dashboard() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("Your Field");
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [farmsLoading, setFarmsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/weather?lat=20.2961&lon=85.8245`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.current) {
          setWeather(data);
          setLocation("Bhubaneswar");
        }
      })
      .catch((e) => console.log("Weather Error:", e));
  }, []);

  useEffect(() => {
    const loadFarms = async () => {
      try {
        const res = await api.get("/farms/");
        setFarms(res.data);
      } catch (err) {
        console.error("Farms load error:", err);
      } finally {
        setFarmsLoading(false);
      }
    };
    loadFarms();
  }, []);

  const crops = [
    { name: "grapes", label: t("crops.grapes", "Grapes"), icon: "/assets/illustrations/grapes.png" },
    { name: "papaya", label: t("crops.papaya", "Papaya"), icon: "/assets/illustrations/papaya.png" },
    { name: "olive", label: t("crops.olive", "Olive"), icon: "/assets/illustrations/olive.png" },
    { name: "rose", label: t("crops.rose", "Rose"), icon: "/assets/illustrations/rose.png" },
    { name: "sugarcane", label: t("crops.sugarcane", "Sugarcane"), icon: "/assets/illustrations/sugarcane.png" },
    { name: "Add", label: t("crops.add", "Add"), icon: "add" }
  ];

  return (
    <PageWrapper className="w-full">
      <div className="w-full space-y-6 pb-20">
        
        {/* LOGO HEADER */}
        <div className="w-full flex items-center justify-center py-2 mb-4">
          <img
            src="/logo.png"
            alt="AgriSat Logo"
            className="h-14 object-contain drop-shadow-neon"
          />
        </div>

        {/* V2 HERO BANNER */}
        <HeroBanner />

        {/* CROP SCROLL */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide py-2 px-1">
          {crops.map((crop) => {
            const isSelected = selectedCrops.includes(crop.name);
            return (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={crop.name}
                onClick={() => {
                  if (crop.name === "Add") return navigate("/select-crops");
                  setSelectedCrops((prev) => prev.includes(crop.name) ? prev.filter((c) => c !== crop.name) : [...prev, crop.name]);
                }}
                className="relative flex-shrink-0 focus:outline-none group flex flex-col items-center"
                type="button"
              >
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-neonGreen text-earthyBlack z-10 w-5 h-5 flex items-center justify-center rounded-full shadow-neon font-black text-xs">
                    ×
                  </div>
                )}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-soft
                    ${isSelected ? "border-neonGreen shadow-neon bg-white/10" : "border-glass-border bg-glass-bg hover:bg-white/5"}`}
                >
                  {crop.icon === "add" ? (
                    <PlusCircle size={28} className="text-neonGreen" />
                  ) : (
                    <img src={crop.icon} alt={crop.name} className="w-10 h-10 object-contain drop-shadow-md" />
                  )}
                </div>
                <p className="mt-2 text-xs font-medium text-text-secondary">{crop.label}</p>
              </motion.button>
            );
          })}
        </div>

        {/* WEATHER CARD */}
        <div className="glass-card overflow-hidden relative">
          <WeatherCard location={location} weather={weather} />
        </div>

        {/* HEAL YOUR CROP */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-neonGreen opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
          
          <h3 className="widget-header mb-4 flex items-center gap-2">
            <Camera className="text-neonGreen" size={20} />
            {t("dashboard.healCrop")}
          </h3>

          <div className="flex items-center justify-between mb-5 px-2 relative z-10">
            <div className="flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center mb-2 border border-glass-border shadow-soft">
                  <Camera size={24} className="text-text-primary" />
               </div>
               <p className="text-xs text-text-secondary">{t("dashboard.takePicture")}</p>
            </div>
            <span className="text-neonGreen/50 font-bold tracking-widest">---&gt;</span>
            <div className="flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center mb-2 border border-glass-border shadow-soft">
                  <FileText size={24} className="text-text-primary" />
               </div>
               <p className="text-xs text-text-secondary">{t("dashboard.seeDiagnosis")}</p>
            </div>
            <span className="text-neonGreen/50 font-bold tracking-widest">---&gt;</span>
            <div className="flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center mb-2 border border-glass-border shadow-soft">
                  <Pill size={24} className="text-text-primary" />
               </div>
               <p className="text-xs text-text-secondary">{t("dashboard.getMedicine")}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/diagnosis")}
            className="primary-btn w-full py-3 tracking-wide"
            type="button"
          >
            {t("dashboard.takePicture")}
          </button>
        </motion.div>

        {/* YOUR FARMS SECTION */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="widget-header flex items-center gap-2">
              <Map className="text-neonGreen" size={20} />
              {t("dashboard.yourFarms", "Your Farms")}
            </h3>
            {farms.length > 0 && (
              <Link to="/add-field" className="text-xs font-bold text-neonGreen hover:text-white transition-colors uppercase tracking-wider">
                + ADD FARM
              </Link>
            )}
          </div>

          {farmsLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 rounded-full border-4 border-neonGreen/20 border-t-neonGreen animate-spin"></div>
            </div>
          ) : farms.length > 0 ? (
            <div className="grid gap-4">
              {farms.map((f) => (
                <FarmCard key={f.id} farm={f} />
              ))}
            </div>
          ) : (
            <FarmCard farm={null} onAdd={() => navigate("/add-field")} />
          )}
        </div>

        {/* MAIN TOOLS GRID */}
        <div className="glass-card p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/weather" className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/20 border border-glass-border hover:border-neonGreen hover:bg-black/40 hover:shadow-neon transition-all group">
              <Cloud size={32} className="text-text-primary group-hover:text-neonGreen transition-colors" />
              <p className="mt-3 text-sm font-medium">{t("dashboard.weather")}</p>
            </Link>
            
            <Link to="/ndvi" className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/20 border border-glass-border hover:border-neonGreen hover:bg-black/40 hover:shadow-neon transition-all group">
              <Activity size={32} className="text-text-primary group-hover:text-neonGreen transition-colors" />
              <p className="mt-3 text-sm font-medium">{t("ndvi.title")}</p>
            </Link>

            <Link to="/farm-insights" className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/20 border border-glass-border hover:border-neonGreen hover:bg-black/40 hover:shadow-neon transition-all group">
              <Map size={32} className="text-text-primary group-hover:text-neonGreen transition-colors" />
              <p className="mt-3 text-sm font-medium">{t("farmInsights.title")}</p>
            </Link>

            <Link to="/profile" className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/20 border border-glass-border hover:border-neonGreen hover:bg-black/40 hover:shadow-neon transition-all group">
              <List size={32} className="text-text-primary group-hover:text-neonGreen transition-colors" />
              <p className="mt-3 text-sm font-medium">{t("ndvi.farmList")}</p>
            </Link>
          </div>
        </div>

        {/* SMART FARMING TOOLS */}
        <div className="glass-card p-5">
          <h3 className="widget-header mb-4 flex items-center gap-2">
             <Sprout size={20} className="text-neonGreen" />
             {t("dashboard.smart_farming", "Smart farming tools")}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { path: "/fertilizer", icon: Sprout, title: t("fertilizer.title"), sub: t("fertilizer.subtitle", "Get dose per acre") },
              { path: "/pests", icon: Bug, title: t("pests.title"), sub: t("pests.subtitle", "Identify & prevent") },
              { path: "/cultivation-tips", icon: BookOpen, title: t("cultivationTips.title"), sub: t("cultivationTips.subtitle", "Best practices") },
              { path: "/pest-alerts", icon: Bell, title: t("pestAlerts.title"), sub: t("pestAlerts.subtitle", "Stay notified") },
              { path: "/market-prices", icon: LineChart, title: t("marketPrices.title"), sub: t("marketPrices.subtitle", "Check mandi rates") },
              { path: "/govt-schemes", icon: Landmark, title: t("govtSchemes.title"), sub: t("govtSchemes.subtitle", "Know your benefits") },
              { path: "/knowledge-hub", icon: BookOpen, title: t("knowledgeHub.title"), sub: t("knowledgeHub.subtitle", "Guides & videos") },
              { path: "/expert", icon: Users, title: t("dashboard.ask_expert", "Ask an expert"), sub: t("dashboard.ask_expert_sub", "Talk to agronomist") },
            ].map((tool, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(tool.path)}
                className="flex flex-col items-start px-4 py-4 rounded-xl bg-black/20 border border-glass-border hover:border-neonGreen hover:shadow-neon transition-all group text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-neonGreen/5 blur-2xl group-hover:bg-neonGreen/20 transition-all rounded-full"></div>
                <tool.icon size={26} className="text-text-primary group-hover:text-neonGreen transition-colors mb-3 relative z-10" />
                <span className="font-semibold text-text-primary group-hover:text-white transition-colors relative z-10">{tool.title}</span>
                <span className="text-xs text-text-secondary mt-1 relative z-10">{tool.sub}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* AGRI LIVE UPDATES */}
        <AgriMediaSection />
      </div>
    </PageWrapper>
  );
}