import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { me } from "../api/auth";
import api from "../api/api";

export default function UserPanel({ onClose, onLogout, onLanguageChange, onThemeToggle, darkMode }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("main"); 
  const [farms, setFarms] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", language: "" });

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const u = await me();
      setUser(u);
      setEditForm({ name: u.name, email: u.email, phone: u.phone, language: u.language });
    } catch (e) {}
  }

  async function loadFarms() {
    try {
      const resp = await api.get("/farms");
      setFarms(resp.data);
    } catch (e) {}
  }

  async function loadNotifications() {
    try {
      const resp = await api.get("/notifications");
      setNotifications(resp.data);
    } catch (e) {}
  }

  useEffect(() => {
    if (activeView === "farms") loadFarms();
    if (activeView === "notifications") loadNotifications();
  }, [activeView]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hasSeenWelcome");
    onLogout?.();
    onClose();
    navigate("/login");
  };

  const navItems = [
    { id: "profile", icon: "👤", label: t("panel.profile", "My Profile") },
    { id: "farms", icon: "🌾", label: t("panel.farms", "My Farms") },
    { id: "insights", icon: "💡", label: t("panel.insights", "Saved Insights"), path: "/farm-insights" },
    { id: "notifications", icon: "🔔", label: t("panel.notifications", "Notifications") },
    { id: "knowledge", icon: "📚", label: t("panel.knowledge", "Knowledge Hub"), path: "/knowledge-hub" },
    { id: "help", icon: "🆘", label: t("panel.help", "Help & Support") },
  ];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/auth/me", editForm);
      await loadUser();
      setActiveView("main");
    } catch (e) { alert("Update failed"); }
    finally { setLoading(false); }
  };

  const handleDeleteFarm = async (id) => {
    if (!window.confirm("Delete this farm?")) return;
    try {
      await api.delete(`/farms/${id}`);
      loadFarms();
    } catch (e) { alert("Failed to delete farm"); }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());
    setLoading(true);
    try {
      await api.post("/support/send", payload);
      alert("Support request sent!");
      setActiveView("main");
    } catch (e) { alert("Failed to send support request"); }
    finally { setLoading(false); }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">AgriSat</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-base">{user.name || "Farmer"}</p>
                <p className="text-xs text-green-100 truncate">{user.email || user.phone || ""}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-white/20" />
              <div>
                <div className="h-4 bg-white/20 rounded w-28 mb-1" />
                <div className="h-3 bg-white/20 rounded w-20" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-2 pb-6">
          <AnimatePresence mode="wait">
            {activeView === "main" && (
              <motion.div key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {navItems.map((item, i) => (
                  <motion.div key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    {item.path ? (
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className="flex items-center gap-4 px-6 py-4 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 transition border-b border-gray-50 dark:border-gray-800"
                      >
                        <span className="text-xl w-7 text-center">{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => setActiveView(item.id)}
                        className="w-full flex items-center gap-4 px-6 py-4 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 transition border-b border-gray-50 dark:border-gray-800"
                      >
                        <span className="text-xl w-7 text-center">{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                      </button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeView === "profile" && (
               <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6">
                 <button onClick={() => setActiveView("main")} className="mb-4 text-sm font-bold text-green-600 flex items-center gap-1">← Back</button>
                 <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
                 <form onSubmit={handleUpdateProfile} className="space-y-4">
                   <div>
                     <label className="text-xs font-bold text-gray-400 block mb-1">NAME</label>
                     <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-400 block mb-1">EMAIL</label>
                     <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm" />
                   </div>
                   <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-green-200 active:scale-95 transition">
                     {loading ? "Updating..." : "Save Changes"}
                   </button>
                 </form>
               </motion.div>
            )}

            {activeView === "farms" && (
              <motion.div key="farms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6">
                <button onClick={() => setActiveView("main")} className="mb-4 text-sm font-bold text-green-600 flex items-center gap-1">← Back</button>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">My Farms</h3>
                  <button onClick={() => { onClose(); navigate("/add-field"); }} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-bold">+ New</button>
                </div>
                <div className="space-y-3">
                  {farms.map(f => (
                    <div key={f.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">{f.name}</p>
                        <p className="text-xs text-gray-500">{f.size_km} km²</p>
                      </div>
                      <button onClick={() => handleDeleteFarm(f.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">🗑️</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeView === "notifications" && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6">
                <button onClick={() => setActiveView("main")} className="mb-4 text-sm font-bold text-green-600 flex items-center gap-1">← Back</button>
                <h3 className="font-bold text-lg mb-4">Notifications</h3>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 rounded-2xl border ${n.is_read ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-green-50 border-green-200'} transition`}>
                      <p className="font-bold text-sm mb-1">{n.title}</p>
                      <p className="text-xs text-gray-600">{n.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="text-center text-gray-400 py-10">No alerts found</p>}
                </div>
              </motion.div>
            )}

            {activeView === "help" && (
              <motion.div key="help" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6">
                <button onClick={() => setActiveView("main")} className="mb-4 text-sm font-bold text-green-600 flex items-center gap-1">← Back</button>
                <h3 className="font-bold text-lg mb-4">Help & Support</h3>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <input name="name" placeholder="Full Name" defaultValue={user?.name} className="w-full p-2.5 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm" required />
                  <input name="email" placeholder="Email Address" defaultValue={user?.email} className="w-full p-2.5 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm" required />
                  <input name="subject" placeholder="What's the issue?" className="w-full p-2.5 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm" required />
                  <textarea name="message" placeholder="Describe your problem..." rows="4" className="w-full p-2.5 rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm" required />
                  <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-green-200 transition">
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mx-4 my-4 h-px bg-gray-100 dark:bg-gray-800" />

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-6 py-2">
            <div className="flex items-center gap-4">
              <span className="text-xl w-7 text-center">🌙</span>
              <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                {t("panel.dark_mode", "Dark Mode")}
              </span>
            </div>
            <button
              onClick={onThemeToggle}
              className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="px-6 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">{t("panel.language", "Language")}</p>
            <div className="flex gap-2">
              {["en", "hi", "or"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => { onLanguageChange?.(lang); onClose(); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                    i18n.language === lang
                      ? "bg-green-600 text-white border-green-600"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-green-400"
                  }`}
                >
                  {lang === "en" ? "EN" : lang === "hi" ? "हि" : "ଓ"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 transition"
          >
            🔐 {t("panel.logout", "Logout")}
          </button>
        </div>
      </motion.div>
    </>
  );
}
