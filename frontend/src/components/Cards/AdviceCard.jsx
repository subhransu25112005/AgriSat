// src/components/AdviceCard.jsx
import React from "react";

export default function AdviceCard({ title="Advice", message }) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand text-xl">
          🌱
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{message}</div>
        </div>
      </div>
    </div>
  );
}
