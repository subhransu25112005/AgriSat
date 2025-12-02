/**
 * src/pages/Profile.jsx
 * Shows profile info, language and logout option
 */
import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { useTranslation } from "react-i18next";

export default function Profile({ onLogout }) {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const r = await api.get("/auth/me");
        if (mounted) {
          setProfile(r.data);
          if (r.data?.language) i18n.changeLanguage(r.data.language);
        }
      } catch (e) {
        console.log("No profile endpoint or not logged in", e);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const doLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    window.location.reload();
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-4">
        <h2 className="font-semibold text-lg mb-2">{t("profile") || "Profile"}</h2>
        {profile ? (
          <div className="space-y-2">
            <div><strong>Name:</strong> {profile.name || "-"}</div>
            <div><strong>Email:</strong> {profile.email || "-"}</div>
            <div><strong>Phone:</strong> {profile.phone || "-"}</div>
            <div><strong>Language:</strong> {profile.language || "en"}</div>
            <div className="mt-3">
              <button className="bg-brand text-white px-3 py-1 rounded" onClick={doLogout}>{t("logout") || "Logout"}</button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Loading...</div>
        )}
      </div>
    </div>
  );
}
