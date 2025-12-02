// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { motion } from "framer-motion";

export default function MainLayout({ children, activeTab="home", onNavChange }) {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div className="min-h-screen bg-lightbg pb-16 md:pb-0">
      {/* Header */}
      <Header onOpenProfile={() => setOpenProfile(true)} />

      {/* Animated Page Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-4xl mx-auto px-4 py-4"
      >
        {children}
      </motion.main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav active={activeTab} onChange={onNavChange} />
    </div>
  );
}
