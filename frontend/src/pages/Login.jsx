// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { login, sendOtp, verifyOtp, googleLogin } from "../api/auth";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [authMode, setAuthMode] = useState("password"); // 'password' or 'otp'
  
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { t } = useTranslation();

  useEffect(() => {
    // Load Google Identity Services native button
    const loadGoogle = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
        console.warn("⚠️ VITE_GOOGLE_CLIENT_ID missing or unconfigured in .env! Native Google Login button will be disabled.");
      }
      
      if (window.google && clientId && clientId !== "YOUR_GOOGLE_CLIENT_ID_HERE") {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-btn"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };
    
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = loadGoogle;
      document.body.appendChild(script);
    } else {
      loadGoogle();
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      const res = await googleLogin(response.credential);
      onLogin(res.data.access_token);
    } catch (err) {
      alert("Google Login failed");
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Enter email and password");
    
    setLoading(true);
    try {
      const res = await login({ email, password });
      onLogin(res.data.access_token);
    } catch (err) {
      alert(err.response?.data?.detail || t("auth.login_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return alert("Enter your email");
    
    setLoading(true);
    try {
      await sendOtp(email);
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) return alert("Enter the OTP code");
    
    setLoading(true);
    try {
      const res = await verifyOtp(email, otpCode);
      onLogin(res.data.access_token);
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 w-full max-w-md rounded-2xl shadow-lg fade-in">
        <div className="text-center mb-6">
          <img src="/glogo.png" alt="AgriSat" className="h-10 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t("auth.welcome")}</h2>
          <p className="text-sm text-gray-500">Log in to your AgriSat account</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
          <button 
            onClick={() => setAuthMode("password")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${authMode === "password" ? "bg-white dark:bg-gray-600 shadow text-green-600 dark:text-green-400" : "text-gray-500"}`}
          >
            Password
          </button>
          <button 
            onClick={() => setAuthMode("otp")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${authMode === "otp" ? "bg-white dark:bg-gray-600 shadow text-green-600 dark:text-green-400" : "text-gray-500"}`}
          >
            OTP Code
          </button>
        </div>

        {authMode === "password" ? (
          <form onSubmit={handlePasswordLogin}>
            <input
              className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
              placeholder="Email or Phone Number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
              placeholder={t("auth.password_placeholder")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="flex justify-end mb-4">
              <Link to="/forgot-password" className="text-xs text-blue-600 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              className="bg-green-600 hover:bg-green-700 transition text-white py-3 w-full rounded-xl font-bold disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Please wait..." : t("auth.login_btn")}
            </button>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <p className="text-xs text-gray-500 mb-2">We will send a 6-digit code to your email.</p>
                <input
                  className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                  placeholder="Enter your Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="bg-green-600 hover:bg-green-700 text-white py-3 w-full rounded-xl font-bold disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p className="text-xs text-green-600 font-semibold mb-2 flex items-center justify-between">
                  <span>OTP Sent to {email}</span>
                  <button type="button" onClick={() => setOtpSent(false)} className="text-blue-500 underline">Edit Email</button>
                </p>
                <input
                  className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-center tracking-[0.5em] font-mono text-lg dark:text-white"
                  placeholder="------"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 w-full rounded-xl font-bold disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <span className="w-1/5 border-b dark:border-gray-700"></span>
          <span className="text-xs text-gray-400 font-semibold uppercase">Or continue with</span>
          <span className="w-1/5 border-b dark:border-gray-700"></span>
        </div>

        <div className="mt-4 flex justify-center">
          <div id="google-btn"></div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-600 font-bold hover:underline">
            Sign up here
          </Link>
        </div>

      </div>
    </div>
  );
}
