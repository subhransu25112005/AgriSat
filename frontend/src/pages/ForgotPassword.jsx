// src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import { sendOtp, resetPassword } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Identifier, 2 = OTP, 3 = New Password
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const navigate = useNavigate();

  // Auto-fill if user logged in context via legacy generic string parsing
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("agrisat_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.email) setIdentifier(user.email);
        else if (user.phone) setIdentifier(user.phone);
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!identifier) return alert("Enter your email or phone number.");
    
    setLoading(true);
    try {
      await sendOtp(identifier);
      alert(identifier.includes("@") ? "OTP sent to your email." : "OTP sent (check SMS/console).");
      setStep(2);
      setTimer(30);
    } catch (err) {
      alert(err.response?.data?.detail || "Error sending OTP request");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return alert("Enter a valid 6-digit OTP.");
    
    // We proceed to step 3 visually. Validation occurs concurrently in /reset-password logic layer
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return alert("Enter a new complex password (min 6 characters).");
    
    setLoading(true);
    try {
      await resetPassword({ 
          email: identifier.includes("@") ? identifier : undefined,
          phone: !identifier.includes("@") ? identifier : undefined,
          token: otp, 
          new_password: newPassword 
      });
      alert("Password updated successfully. You can now login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid or expired OTP");
      setStep(2); // kick back to OTP if expired/wrong
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 w-full max-w-md rounded-2xl shadow-lg fade-in">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white text-center">Reset Password</h2>
        
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="mt-6">
            <p className="text-sm text-gray-500 mb-4 text-center">
              Enter your registered email or phone number to receive a verification OTP.
            </p>
            <input 
              className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-6 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
              placeholder="Email or Phone Number" 
              type="text" 
              value={identifier} 
              onChange={(e)=>setIdentifier(e.target.value)} 
            />
            <button 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 w-full rounded-xl font-bold disabled:opacity-50 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="mt-6">
            <p className="text-sm text-gray-500 mb-4 text-center">
              Enter the 6-digit OTP sent to <span className="font-bold text-gray-700 dark:text-gray-300">{identifier}</span>.
            </p>
            <input 
              className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-4 mt-1 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center text-lg dark:text-white" 
              placeholder="------" 
              maxLength={6}
              value={otp} 
              onChange={(e)=>setOtp(e.target.value)} 
            />
            
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 w-full rounded-xl font-bold transition"
            >
              Verify OTP
            </button>
            
            <div className="mt-4 text-center">
                <button 
                  type="button"
                  disabled={timer > 0 || loading}
                  onClick={handleSendOtp}
                  className="text-sm text-blue-500 font-semibold disabled:text-gray-400"
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="mt-6">
            <p className="text-sm text-green-600 font-semibold mb-4 text-center">
              OTP verified. Please enter your new strong password.
            </p>
            <p className="text-xs font-bold text-gray-500 uppercase mt-2">New Password</p>
            <input 
              className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 w-full mb-6 mt-1 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
              placeholder="Enter new complex password" 
              type="password" 
              value={newPassword} 
              onChange={(e)=>setNewPassword(e.target.value)} 
            />
            
            <button 
              disabled={loading} 
              className="bg-green-600 hover:bg-green-700 text-white py-3 w-full rounded-xl font-bold disabled:opacity-50 transition"
            >
              {loading ? "Resetting..." : "Set New Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-500 font-bold hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
