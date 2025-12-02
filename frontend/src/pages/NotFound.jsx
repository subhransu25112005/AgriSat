/**
 * src/pages/NotFound.jsx
 */
import React from "react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card p-6 text-center">
        <h2 className="text-2xl font-semibold mb-2">404</h2>
        <p className="text-sm text-gray-600">Page not found</p>
        <div className="mt-4">
          <a href="/" className="text-brand underline">Go home</a>
        </div>
      </div>
    </div>
  );
}
