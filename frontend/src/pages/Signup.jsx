/**
 * src/pages/Signup.jsx
 * Signup form that creates user and auto-login
 */
import React, { useState } from "react";
import { signup, login } from "../api/auth";
import { setAuth } from "../api/api";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSignup} className="bg-white dark:bg-gray-800 p-8 w-full max-w-md rounded-2xl shadow-lg fade-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">{t("auth.signup_title")}</h2>

        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
        <input className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-3 mt-1 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white" placeholder={t("auth.name_placeholder")} value={name} onChange={(e) => setName(e.target.value)} required />

        <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
        <input className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-3 mt-1 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white" placeholder={t("auth.email_placeholder")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
        <input className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-3 mt-1 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white" placeholder={t("auth.phone_placeholder")} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />

        <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
        <input className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-6 mt-1 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white" placeholder={t("auth.password_placeholder")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button disabled={loading} className="bg-green-600 hover:bg-green-700 text-white py-3 w-full rounded-xl font-bold disabled:opacity-50 transition">
          {loading ? t("common.loading") : t("auth.signup_btn")}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Log in here
          </Link>
        </div>
      </form>
    </div>
  );
}
