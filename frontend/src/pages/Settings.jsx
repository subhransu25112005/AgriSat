import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/api";

export default function Settings(){
  const { t, i18n } = useTranslation();
  const [push, setPush] = useState(false);
  const changeLang = (lng) => { i18n.changeLanguage(lng); /* optionally call backend to save */ };
  return (
    <div className="card p-4 max-w-2xl mx-auto">
      <h2 className="font-semibold mb-3">{t("settings")}</h2>

      <div className="mb-4">
        <label className="block text-sm mb-1">{t("language")}</label>
        <select className="border p-2 rounded w-full" onChange={(e)=>changeLang(e.target.value)} defaultValue="en">
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="or">ଓଡ଼ିଆ</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{t("receive_push")}</div>
          <div className="text-xs text-gray-500">Weather & crop alerts</div>
        </div>
        <input type="checkbox" checked={push} onChange={(e)=>setPush(e.target.checked)} />
      </div>
    </div>
  );
}
