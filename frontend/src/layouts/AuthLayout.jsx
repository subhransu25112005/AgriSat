// src/layouts/AuthLayout.jsx
import React from "react";
import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lightbg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
      >
        <div className="flex items-center justify-center mb-4">
          <img src="/logo.svg" alt="AgriSat" className="h-14 w-14" />
        </div>

        {children}
      </motion.div>
    </div>
  );
}
