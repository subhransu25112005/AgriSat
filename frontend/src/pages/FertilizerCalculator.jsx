import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FertilizerCalculator() {
  // ---------------------------
  // CROP DATABASE (your crops)
  // ---------------------------
  const crops = {
    Grapes: { icon: "/assets/illustrations/grapes.png", N: 800, P: 800, K: 700 },
    Papaya: { icon: "/assets/illustrations/papaya.png", N: 900, P: 700, K: 600 },
    Olive: { icon: "/assets/illustrations/olive.png", N: 600, P: 500, K: 400 },
    Rose: { icon: "/assets/illustrations/rose.png", N: 400, P: 300, K: 300 },
    Sugarcane: { icon: "/assets/illustrations/sugarcane.png", N: 1000, P: 700, K: 900 },
    Banana: { icon: "/assets/illustrations/banana.png", N: 1200, P: 900, K: 1000 },
  };

  const cropNames = Object.keys(crops);

  // -----------------------------
  // FERTILIZER DATABASE
  // -----------------------------
  const fertilizers = {
    Urea: { N: 46, P: 0, K: 0, price: 7 },
    DAP: { N: 18, P: 46, K: 0, price: 29 },
    MOP: { N: 0, P: 0, K: 60, price: 25 },
    NPK: { N: 16, P: 16, K: 16, price: 32 },
  };

  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState("Grapes");
  const [selectedFert, setSelectedFert] = useState("DAP");
  const [trees, setTrees] = useState(1);

  const [result, setResult] = useState(null);

  // -----------------------------
  //     CALCULATION FUNCTION
  // -----------------------------
  const calculate = () => {
    console.log("CALCULATE CLICKED");

    const crop = crops[selectedCrop];
    const fert = fertilizers[selectedFert];

    const totalN = crop.N * trees;
    const totalP = crop.P * trees;
    const totalK = crop.K * trees;

    let totalFert = 0;

    // N
    if (fert.N > 0) {
      totalFert += totalN / (fert.N * 10);
    }

    // P
    if (fert.P > 0) {
      totalFert += totalP / (fert.P * 10);
    }

    // K
    if (fert.K > 0) {
      totalFert += totalK / (fert.K * 10);
    }

    const cost = totalFert * fert.price;

    setResult({
      N: totalN,
      P: totalP,
      K: totalK,
      fertRequired: totalFert.toFixed(2),
      cost: Math.round(cost),
    });

    console.log("RESULT:", {
      N: totalN,
      P: totalP,
      K: totalK,
      fertRequired: totalFert,
      cost,
    });
  };

  const cropData = crops[selectedCrop];

  return (
    <div className="p-5 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold">{t("fertilizer.title")}</h1>
      <p className="text-gray-600 mb-6">{t("fertilizer.subtitle", "Get accurate nutrient recommendation")}</p>

      {/* CROP SELECTION */}
      <label className="font-medium">{t("fertilizer.selectCrop", "Select Crop")}</label>
      <div className="bg-gray-100 p-3 rounded-xl mb-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={cropData.icon} className="w-8 h-8" />
          <span className="font-semibold">{selectedCrop}</span>
        </div>

        <select
          className="bg-transparent outline-none font-medium"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          {cropNames.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* FERTILIZER TYPE */}
      <label className="font-medium">{t("fertilizer.fertType", "Fertilizer Type")}</label>
      <select
        className="w-full bg-gray-100 p-3 rounded-xl mb-6 font-medium"
        value={selectedFert}
        onChange={(e) => setSelectedFert(e.target.value)}
      >
        {Object.keys(fertilizers).map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      {/* N P K Display */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-100 p-4 rounded-xl text-center">
          <p className="font-bold">N</p>
          <p>{cropData.N} g</p>
          <p className="text-sm text-gray-600">{cropData.N / 1000} kg/tree</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl text-center">
          <p className="font-bold">P</p>
          <p>{cropData.P} g</p>
          <p className="text-sm text-gray-600">{cropData.P / 1000} kg/tree</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl text-center">
          <p className="font-bold">K</p>
          <p>{cropData.K} g</p>
          <p className="text-sm text-gray-600">{cropData.K / 1000} kg/tree</p>
        </div>
      </div>

      {/* Tree Counter */}
      <label className="font-medium">{t("fertilizer.numTrees", "Number of Trees")}</label>
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl">
        <button
          onClick={() => setTrees(Math.max(1, trees - 1))}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl font-bold"
        >
          –
        </button>

        <p className="text-xl font-semibold">{trees} {t("fertilizer.trees", "Trees")}</p>

        <button
          onClick={() => setTrees(trees + 1)}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl font-bold"
        >
          +
        </button>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        className="w-full py-3 rounded-xl text-lg bg-green-600 text-white font-semibold mt-5 hover:bg-green-700"
      >
        {t("fertilizer.calculate")}
      </button>

      {/* RESULT BLOCK */}
      {result && (
        <div className="mt-8 bg-gray-100 p-5 rounded-xl">
          <h3 className="text-lg font-bold mb-3">{t("fertilizer.result", "Result")}</h3>

          <p className="font-medium">{t("fertilizer.nitrogen")} (N): {result.N} g</p>
          <p className="font-medium">{t("fertilizer.phosphorus")} (P): {result.P} g</p>
          <p className="font-medium">{t("fertilizer.potassium")} (K): {result.K} g</p>

          <p className="font-semibold mt-3">
            {t("fertilizer.fertRequired", "Fertilizer Required")}: {result.fertRequired} kg
          </p>

          <p className="font-bold text-green-700 mt-1">
            {t("fertilizer.estimatedCost", "Estimated Cost")}: ₹{result.cost}
          </p>
        </div>
      )}
    </div>
  );
}
