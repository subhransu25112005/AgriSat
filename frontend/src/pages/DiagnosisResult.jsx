import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDiseaseIntelligence } from "../api/diseaseIntelligence";

// ─── NEW: Farmer Checklist Item (modular) ─────────────────────────────────────
function ChecklistItem({ item }) {
  const [checked, setChecked] = useState(false);
  return (
    <div
      className="flex items-start gap-2 mb-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
      onClick={() => setChecked(!checked)}
    >
      <input
        type="checkbox"
        checked={checked}
        readOnly
        className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer flex-shrink-0"
      />
      <span
        className={`text-sm ${checked
            ? "line-through text-gray-400"
            : "text-gray-700 dark:text-gray-200 font-medium"
          }`}
      >
        {item}
      </span>
    </div>
  );
}

// ─── NEW: Intelligence Sections (appended below existing UI) ─────────────────
function IntelligencePanel({ intelligence }) {
  const [showExplanation, setShowExplanation] = useState(false);

  const getSeverityColor = (sev) => {
    if (sev === "Severe") return "bg-red-100    text-red-800    border-red-300    dark:bg-red-900/30    dark:text-red-400";
    if (sev === "Moderate") return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400";
    if (sev === "Mild") return "bg-green-100  text-green-800  border-green-300  dark:bg-green-900/30  dark:text-green-400";
    return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div className="space-y-4 mt-4">

      {/* ── Urgency Banner ───────────────────────────────────────────── */}
      <div className={`p-3 rounded-xl font-bold text-sm flex items-center gap-2 border ${intelligence.urgency.includes("Immediate")
          ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/40"
          : intelligence.urgency.includes("Safe")
            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/40"
            : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/40"
        }`}>
        {intelligence.urgency}
      </div>

      {/* ── Severity + Recovery Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-xl border ${getSeverityColor(intelligence.severity)}`}>
          <p className="text-[10px] uppercase font-black opacity-70">🧬 Severity</p>
          <p className="font-bold text-sm mt-1">{intelligence.severity}</p>
        </div>
        <div className="p-3 rounded-xl border bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40">
          <p className="text-[10px] uppercase font-black opacity-70">📈 Recovery</p>
          <p className="font-bold text-sm mt-1">
            {intelligence.recoveryScore !== "Coming soon"
              ? `${intelligence.recoveryScore}% Chance`
              : "Coming soon"}
          </p>
        </div>
      </div>

      {/* ── Smart Analysis ───────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2 text-sm">
          🔍 Smart Analysis
        </h3>
        <div className="space-y-1.5">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Spreading Risk:</span> {intelligence.spreadRisk}
          </p>
          {intelligence.symptomsTracker.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Visual Symptoms:</p>
              <ul className="space-y-1">
                {intelligence.symptomsTracker.map((s, i) => (
                  <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <span className="text-green-500">✔</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── Why this diagnosis? ──────────────────────────────────────── */}
      <div>
        <button
          onClick={() => setShowExplanation((p) => !p)}
          className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-3 rounded-xl font-bold text-sm flex justify-between items-center border border-blue-100 dark:border-blue-800/30"
        >
          <span>🧠 Why this diagnosis?</span>
          <span>{showExplanation ? "▲" : "▼"}</span>
        </button>
        {showExplanation && (
          <div className="bg-blue-50/60 dark:bg-blue-900/10 p-4 rounded-b-xl text-xs text-gray-600 dark:text-gray-300 border border-blue-100 dark:border-blue-900/30 border-t-0">
            Because visual symptoms matched:{" "}
            <strong>
              {intelligence.symptomsTracker.join(", ") || "Known patterns"}
            </strong>
            .<br />
            <br />
            Infection spread risk is currently classified as{" "}
            <strong>{intelligence.spreadRisk}</strong>.
          </div>
        )}
      </div>

      {/* ── Yield Impact ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-3 text-sm">
          📉 Yield Impact Prediction
        </h3>
        <p className="text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30 mb-2">
          If untreated → {intelligence.yieldImpact}
        </p>
        <p className="text-xs font-semibold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 p-2.5 rounded-lg border border-green-100 dark:border-green-900/30">
          If treated → Recovery possible
        </p>
      </div>

      {/* ── Smart Farm Advisor ───────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2 text-sm">
          🤖 Smart Farm Advisor
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl border-l-4 border-blue-500 font-medium">
          {intelligence.smartAdvice}
        </p>
      </div>

      {/* ── Farmer Action Checklist ──────────────────────────────────── */}
      {intelligence.advancedTreatment.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-3 text-sm">
            🌾 Farmer Action Checklist
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-2">
            {intelligence.advancedTreatment.map((item, idx) => (
              <ChecklistItem key={idx} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* ── Organic Alternative ──────────────────────────────────────── */}
      {intelligence.organic && intelligence.organic !== "Coming soon" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-green-700 dark:text-green-500 flex items-center gap-2 mb-2 text-sm">
            🌱 Organic Alternative
          </h3>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {intelligence.organic}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main DiagnosisResult (ORIGINAL PRESERVED — intelligence appended below) ──
export default function DiagnosisResult() {
  const { t, i18n } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // NEW: load intelligence from knowledge base
  const intelligence = useMemo(() => {
    if (!state || state.failed) return null;
    return getDiseaseIntelligence(state.disease);
  }, [state]);

  // NEW: persist structured history to localStorage
  useEffect(() => {
    if (state && !state.failed && intelligence) {
      try {
        const prev = JSON.parse(localStorage.getItem("crop_history") || "[]");
        const entry = {
          crop: state.plant !== "Unknown" ? state.plant : "Unknown Crop",
          disease: state.disease,
          severity: intelligence.severity || "Unknown",
          date: new Date().toISOString(),
        };
        // Deduplicate within 5 s to avoid double-save on StrictMode
        const last = prev[0];
        if (!last || last.disease !== entry.disease || (Date.now() - new Date(last.date)) > 5000) {
          prev.unshift(entry);
          localStorage.setItem("crop_history", JSON.stringify(prev.slice(0, 10)));
        }
      } catch (_) { }
    }
  }, [state, intelligence]);

  // ORIGINAL: cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // ORIGINAL: speak handler — enhanced to use intelligence when available
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const safeTreatment = intelligence?.advancedTreatment?.length
      ? intelligence.advancedTreatment.join(". ")
      : Array.isArray(state.treatment)
        ? state.treatment.join(". ")
        : state.treatment;

    const textToSpeak = `${state.disease}. ${t("result.symptoms")}: ${state.symptoms}. ${t("result.treatment")}: ${safeTreatment}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang =
      i18n.language === "hi" ? "hi-IN" : i18n.language === "or" ? "or-IN" : "en-US";
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // ORIGINAL: guard
  if (!state) return <p>No data received</p>;

  return (
    <div className="p-5 max-w-lg mx-auto pb-24">
      {/* ── ORIGINAL HEADER ──────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t("result.title")}</h1>
        <button
          onClick={handleSpeak}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold"
        >
          {isSpeaking ? `🛑 ${t("result.stop", "Stop")}` : `🔊 ${t("result.listen", "Listen")}`}
        </button>
      </div>

      {state.failed ? (
        /* ── ORIGINAL FAILED STATE ──────────────────────────────────── */
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl shadow p-5 mb-4 text-center border border-red-100 dark:border-red-900/40">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Detection Failed</h2>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {state.message || "Unable to detect. Try a clearer image."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ── ORIGINAL: Disease + Confidence card ─────────────────── */}
          <div className="bg-white rounded-2xl shadow p-5 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-gray-800">
              {state.plant !== "Unknown" && state.plant !== "Unknown Plant"
                ? `${state.plant} — `
                : ""}
              {state.disease}
            </h2>

            <div className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">{t("result.confidence")}:</span>{" "}
              {(state.confidence * 100).toFixed(1)}%
            </div>

            {state.confidence < 0.5 && (
              <div className="mt-3 bg-red-50 text-red-800 p-2 rounded text-xs font-medium border border-red-200">
                ⚠ Low confidence. Result may not be accurate. Try clearer image.
              </div>
            )}
          </div>

          {/* ── ORIGINAL: Cause / Symptoms / Treatment / Medicine / Prevention ── */}
          <div className="bg-white rounded-2xl shadow p-5">
            {state.cause && state.cause !== "N/A" && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span>🔬</span> {t("result.cause", "Cause")}
                </h3>
                <p className="text-gray-600 mt-1 pl-6">{state.cause}</p>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span>🦠</span> {t("result.symptoms", "Symptoms")}
              </h3>
              <p className="text-gray-600 mt-1 pl-6">{state.symptoms}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span>📋</span> {t("result.treatment")}
              </h3>
              <ul className="text-gray-600 mt-2 pl-10 list-decimal list-outside space-y-1">
                {Array.isArray(state.treatment) ? (
                  state.treatment.map((step, idx) => <li key={idx}>{step}</li>)
                ) : (
                  <li>{state.treatment}</li>
                )}
              </ul>
            </div>

            {state.medicine && state.medicine !== "N/A" && (
              <div className="mb-4 mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                  <span>💊</span> {t("result.medicine", "Medicine")}
                </h3>
                <p className="text-blue-900 font-medium pl-6">{state.medicine}</p>

                {state.dosage && state.dosage !== "N/A" && (
                  <div className="ml-6 mt-2 bg-white px-3 py-2 rounded shadow-sm text-sm border border-blue-50">
                    <span className="font-semibold text-gray-600">
                      {t("result.dosage", "Dosage")}:
                    </span>{" "}
                    <span className="text-blue-700">{state.dosage}</span>
                  </div>
                )}
              </div>
            )}

            {state.prevention && state.prevention !== "N/A" && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-bold text-green-700 flex items-center gap-2">
                  <span>🛡️</span> {t("result.prevention", "Prevention Tips")}
                </h3>
                <p className="text-gray-600 mt-1 pl-6">{state.prevention}</p>
              </div>
            )}
          </div>

          {/* ── NEW: Intelligence Panel (appended below, never replaces) ── */}
          {intelligence && <IntelligencePanel intelligence={intelligence} />}
        </div>
      )}

      {/* ── ORIGINAL: Diagnose Another button ───────────────────────── */}
      <button
        onClick={() => navigate("/diagnosis")}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mt-6"
      >
        {t("result.diagnoseAnother", "Diagnose Another Image")}
      </button>
    </div>
  );
}
