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
        <h2 className="font-semibold text-lg mb-2">{t("profile.title")}</h2>
        {profile ? (
          <div className="space-y-2">
            <div><strong>{t("profile.name", "Name")}:</strong> {profile.name || "-"}</div>
            <div><strong>{t("profile.email", "Email")}:</strong> {profile.email || "-"}</div>
            <div><strong>{t("profile.phone", "Phone")}:</strong> {profile.phone || "-"}</div>
            <div><strong>{t("profile.language", "Language")}:</strong> {profile.language || "en"}</div>
            <div className="mt-3">
              <button className="bg-brand text-white px-3 py-1 rounded" onClick={doLogout}>{t("profile.logout")}</button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">{t("common.loading")}</div>
        )}
      </div>
    </div>
  );
}
