import React from "react";
import { motion } from "framer-motion";

export default function WelcomeSlide({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-20 flex flex-col items-center justify-center w-full max-w-md mx-auto text-center px-6"
    >
      {children}
    </motion.div>
  );
}
