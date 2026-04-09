import React from "react";

export default function NDVICard({ ndvi }) {
  if (ndvi === undefined || ndvi === null) return <div className="text-sm text-gray-500">No data</div>;
  const label = ndvi > 0.5 ? "Healthy" : ndvi > 0.3 ? "Moderate" : "Low";
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-brand">{ndvi}</div>
      <div className="mt-2 text-sm text-gray-600">{label}</div>
    </div>
  );
}
