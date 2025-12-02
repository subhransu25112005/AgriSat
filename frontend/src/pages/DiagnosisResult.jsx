import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DiagnosisResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No data received</p>;

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Diagnosis Result</h1>

      <div className="bg-white rounded-2xl shadow p-5 mb-4">
        <h2 className="text-xl font-semibold text-green-700">
          {state.disease}
        </h2>
        <p className="text-gray-600 mb-2">
          Confidence: {(state.confidence * 100).toFixed(1)}%
        </p>

        <h3 className="font-semibold mt-3">Symptoms</h3>
        <p className="text-gray-700">{state.symptoms}</p>

        <h3 className="font-semibold mt-3">Treatment</h3>
        <p className="text-gray-700">{state.treatment}</p>
      </div>

      <button
        onClick={() => navigate("/diagnosis")}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
      >
        Diagnose Another Image
      </button>
    </div>
  );
}
