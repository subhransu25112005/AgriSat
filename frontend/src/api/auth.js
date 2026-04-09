// src/api/auth.js
import { api } from "./api";

// Core Email/Password
export const signup = (payload) => api.post("/auth/signup", payload);

export const login = (payload) => 
  api.post("/auth/login", { 
    email: payload.email, 
    phone: payload.phone,
    username: payload.email || payload.phone, // Cross-compatibility fallback
    password: payload.password 
  });

// OTP login
export const sendOtp = (identifier) => api.post("/auth/send-otp", { 
    email: identifier.includes("@") ? identifier : undefined,
    phone: !identifier.includes("@") ? identifier : undefined
});
export const verifyOtp = (identifier, code) => api.post("/auth/verify-otp", { 
    email: identifier.includes("@") ? identifier : undefined,
    phone: !identifier.includes("@") ? identifier : undefined,
    code 
});

// Google OAuth
export const googleLogin = (token, language = "en") => 
  api.post("/auth/google", { token, language });

// Password Rest
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
export const resetPassword = (payload) => api.post("/auth/reset-password", payload);

// Verify current session
export const me = () => api.get("/auth/me").then((r) => r.data).catch(() => null);
