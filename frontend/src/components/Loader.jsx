// src/components/Loader.jsx
import React from "react";

export default function Loader({ size=40, text=null }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div style={{width:size, height:size}} className="rounded-full border-4 border-brand border-t-transparent animate-spin"></div>
      {text && <div className="text-sm text-gray-600">{text}</div>}
    </div>
  );
}
