// src/components/BottomNav.jsx
import React from "react";

export default function BottomNav({ active="home", onChange }) {
  const tabs = [
    {key:'home', label:'Your crops', icon:'🌾'},
    {key:'community', label:'Community', icon:'💬'},
    {key:'market', label:'Market', icon:'🛒'},
    {key:'you', label:'You', icon:'👤'},
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <div className="flex justify-around p-2">
        {tabs.map(t => (
          <button key={t.key} onClick={()=> onChange && onChange(t.key)} className="flex flex-col items-center text-xs py-1 px-2">
            <div className={`text-2xl ${active===t.key?'scale-110':''}`}>{t.icon}</div>
            <div className={`mt-1 ${active===t.key?'text-brand font-semibold text-sm':''}`}>{t.label}</div>
          </button>
        ))}
      </div>
    </nav>
  );
}
