/**
 * src/pages/Signup.jsx
 * Signup form that creates user and auto-login
 */
import React, { useState } from "react";
import { signup, login } from "../api/auth";
import { setAuth } from "../api/api";
import { useTranslation } from "react-i18next";

export default function Signup({ onSignedUp }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({ email, phone, password, name, language: "en" });
      // auto login
      const res = await login({ email, password });
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setAuth(token);
      if (onSignedUp) onSignedUp(token);
    } catch (err) {
      console.error(err);
      alert(t("auth.signup_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSignup} className="card p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">{t("auth.signup_title")}</h2>
        <input className="border p-2 w-full mb-3 rounded" placeholder={t("auth.name_placeholder")} value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="border p-2 w-full mb-3 rounded" placeholder={t("auth.email_placeholder")} value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="border p-2 w-full mb-3 rounded" placeholder={t("auth.phone_placeholder")} value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <input className="border p-2 w-full mb-3 rounded" placeholder={t("auth.password_placeholder")} type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="bg-brand text-white py-2 w-full rounded">{loading ? t("common.loading") : t("auth.signup_btn")}</button>
      </form>
    </div>
  );
}
