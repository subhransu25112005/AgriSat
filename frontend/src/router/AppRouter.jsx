// src/router/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import WeatherPage from "../pages/WeatherPage";
import FarmInsights from "../pages/FarmInsights";
import AddField from "../pages/AddField";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

import { useAuth } from "../hooks/useAuth";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />

        {/* Protected / Main App Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainScreen />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

function MainScreen() {
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const activeTab =
    pathname === "/" ? "home"
    : pathname.includes("community") ? "community"
    : pathname.includes("market") ? "market"
    : "you";

  return (
    <MainLayout 
      activeTab={activeTab}
      onNavChange={(tab) => {
        if (tab === "home") navigate("/");
        if (tab === "community") navigate("/community");
        if (tab === "market") navigate("/market");
        if (tab === "you") navigate("/profile");
      }}
    >
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/insights" element={<FarmInsights />} />
        <Route path="/add-field" element={<AddField />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  );
}
