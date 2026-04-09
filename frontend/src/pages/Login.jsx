// src/pages/Login.jsx
import React, { useState } from "react";
import { login } from "../api/auth";
import { useTranslation } from "react-i18next";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      onLogin(res.data.access_token);
    } catch (err) {
      alert(t("auth.login_failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handle} className="card p-6 w-full max-w-md fade-in">
        <h2 className="text-2xl font-semibold mb-4">{t("auth.welcome")}</h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder={t("auth.email_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder={t("auth.password_placeholder")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-brand text-white py-2 w-full rounded"
          type="submit"
        >
          {t("auth.login_btn")}
        </button>
      </form>
    </div>
  );
}
