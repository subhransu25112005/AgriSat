import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CANNED = [
  "Should I irrigate today?",
  "Best time to spray?",
  "Is it safe to harvest now?",
  "Will it rain this week?"
];

function getResponse(question, current) {
  if (!current) return "Connecting to weather sensors...";
  const temp = current.main.temp;
  const humidity = current.main.humidity;
  const wind = current.wind.speed;
  const cond = current.weather[0].main.toLowerCase();
  const q = question.toLowerCase();

  if (q.includes("irrigat")) {
    if (cond.includes("rain")) return "🌧 Rain is currently active. No irrigation needed today — preserve water.";
    if (humidity > 70) return "💧 Humidity is high. Delay irrigation by at least 24 hours.";
    if (temp > 33) return "🔥 Temperature is high. Irrigate early morning (5–7 AM) to reduce water loss.";
    return "✅ Conditions are favorable. Irrigate during cooler hours for best absorption.";
  }

  if (q.includes("spray")) {
    if (wind > 5) return "💨 Wind speed is " + wind.toFixed(1) + " m/s. Avoid spraying — chemical drift is likely.";
    if (cond.includes("rain")) return "🌧 Rain detected. Spraying is ineffective and wasteful. Postpone.";
    if (temp >= 18 && temp <= 28) return "✅ Optimal spray window. Temperature and wind are ideal right now.";
    return "⚠️ Marginal conditions. Spray with caution. Monitor wind changes.";
  }

  if (q.includes("harvest")) {
    if (cond.includes("rain")) return "🌧 Rainy conditions will delay drying. Avoid harvesting today.";
    if (humidity < 60 && temp > 22) return "✅ Good harvest conditions. Low humidity ensures fast grain drying.";
    return "⚠️ Monitor humidity before proceeding with harvest.";
  }

  if (q.includes("rain")) {
    if (cond.includes("rain")) return "🌧 Rain is active right now in your region.";
    return "📡 No rain detected currently. Check the 7-day forecast section below for upcoming rain events.";
  }

  return `📡 Analyzing: Temp ${Math.round(temp)}°C, Humidity ${humidity}%, Wind ${wind.toFixed(1)} m/s. ${
    temp > 33 ? "⚠️ Heat stress risk." : humidity > 70 ? "⚠️ High moisture conditions." : "✅ Conditions appear stable."
  }`;
}

export default function AIChatAssistant({ current }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hello! I'm your Farm AI. Ask me about irrigation, spraying, or harvest conditions." }
  ]);
  const [input, setInput] = useState("");

  const send = (text) => {
    const q = text || input.trim();
    if (!q) return;
    setMessages(m => [...m, { from: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { from: "ai", text: getResponse(q, current) }]);
    }, 500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 right-5 z-[5000] w-14 h-14 rounded-full
                   bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl
                   shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center"
      >
        {open ? "✕" : "🤖"}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className="fixed bottom-44 right-4 z-[5000] w-[340px] max-h-[70vh]
                       bg-gray-950 border border-white/10 rounded-[2rem] overflow-hidden
                       shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-b border-white/10">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-0.5">🤖 Farm AI Assistant</p>
              <p className="text-[10px] text-white/40 font-bold">Powered by real-time weather intelligence</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] text-xs font-bold leading-relaxed p-3 rounded-2xl ${
                    m.from === "user"
                      ? "bg-emerald-600 text-white rounded-br-sm"
                      : "bg-white/8 text-white/80 border border-white/10 rounded-bl-sm"
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick prompts */}
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {CANNED.map((c, i) => (
                <button
                  key={i}
                  onClick={() => send(c)}
                  className="text-[8px] font-black uppercase tracking-wide px-3 py-1.5
                             bg-white/5 border border-white/10 rounded-full text-white/50
                             hover:bg-white/10 hover:text-white/80 transition flex-shrink-0"
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask about your farm..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-xs
                           text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50"
              />
              <button
                onClick={() => send()}
                className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white
                           font-black text-sm transition flex items-center justify-center flex-shrink-0"
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
