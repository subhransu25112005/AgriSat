import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CultivationTips() {
  const { t } = useTranslation();
  // --- Crops from your app ---
  const crops = [
    "Grapes",
    "Papaya",
    "Olive",
    "Rose",
    "Sugarcane",
    "Almond",
    "Apple",
    "Apricot",
    "Banana",
    "Barley",
    "Bean",
    "Bitter Gourd",
    "Black Bean",
    "Brinjal",
    "Cabbage",
  ];

  // Selected crop
  const [crop, setCrop] = useState("Grapes");

  // ---- Cultivation tips database ----
  const tipsDB = {
    Grapes: {
      soil: "Well-drained sandy loam soil with pH 6.5–7.5.",
      watering: "Irrigate every 5–7 days; avoid waterlogging.",
      fertilizer:
        "Apply FYM + NPK (50:50:50 g per vine) before flowering and after pruning.",
      pests:
        "Prevent powdery mildew with sulfur spray; control mealybug using sticky traps.",
      season: "Best planted during January–February.",
      harvest: "Harvest 110–130 days after pruning when berries soften.",
    },
    Papaya: {
      soil: "Light loamy soil rich in organic matter.",
      watering: "Irrigate every 7 days in summer, 12 days in winter.",
      fertilizer: "Apply NPK (250:250:500 g/plant/year) in 4 splits.",
      pests: "Control mealybugs with neem oil; remove infected leaves.",
      season: "Best transplanted Feb–March.",
      harvest: "Pick fruits when the bottom turns yellow.",
    },
    Olive: {
      soil: "Deep well-drained loamy soil with pH 7–8.5.",
      watering: "Light irrigation every 15–20 days.",
      fertilizer: "NPK 150:100:200 g per tree annually.",
      pests: "Control olive fruit fly using pheromone traps.",
      season: "Plant during autumn or early spring.",
      harvest: "Harvest 6–8 months after flowering when fruits turn dark.",
    },
    Rose: {
      soil: "Fertile sandy loam soil with pH 6–7.",
      watering: "Water every 3–4 days depending on temperature.",
      fertilizer: "Apply NPK 20:20:20 twice a month + organic compost.",
      pests: "Aphids and mites—use neem oil spray weekly.",
      season: "Plant in October–November.",
      harvest: "Harvest early morning when flowers are half open.",
    },
    Sugarcane: {
      soil: "Deep loamy soil with high organic matter.",
      watering: "Irrigate every 10–12 days; maintain soil moisture.",
      fertilizer: "Apply NPK 75:40:40 at planting, 60 days, 120 days.",
      pests: "Use light traps for early shoot borer.",
      season: "Plant Feb–March.",
      harvest: "Harvest after 10–12 months when cane is mature.",
    },
    Almond: {
      soil: "Well-drained loamy to sandy soil.",
      watering: "Irrigate every 10–12 days during fruit set.",
      fertilizer: "Apply NPK (500:300:200 g/tree/year).",
      pests: "Control aphids with soapy water spray.",
      season: "Plant in winter (Dec–Jan).",
      harvest: "Harvest when hulls split open naturally.",
    },
    Apple: {
      soil: "Deep loam soil rich in organic matter.",
      watering: "Irrigate every 7–10 days during dry weather.",
      fertilizer: "Apply NPK 70:35:70 g per tree annually.",
      pests: "Use pheromone traps to manage codling moth.",
      season: "Plant in winter (Dec–Jan).",
      harvest: "Harvest when fruit detaches easily with a twist.",
    },
    Apricot: {
      soil: "Sandy loam to loam soil, pH 6–7.",
      watering: "Water every 12–15 days; avoid over-irrigation.",
      fertilizer: "Apply NPK 40:40:70 g per tree/year.",
      pests: "Control leaf miners using neem oil.",
      season: "Plant in early winter.",
      harvest: "Harvest when fruits turn yellow-orange.",
    },
    Banana: {
      soil: "Rich loamy soil with high organic matter.",
      watering: "Irrigate every 5–7 days; maintain constant moisture.",
      fertilizer: "Apply NPK 200:60:200 g per plant.",
      pests: "Control banana weevil with pheromone traps.",
      season: "Plant Feb–March or July–August.",
      harvest: "Harvest 11–12 months after planting.",
    },
    Barley: {
      soil: "Sandy loam soil with pH 6–7.5.",
      watering: "Light irrigation at tillering and grain filling stages.",
      fertilizer: "Apply NPK 40:20:20 kg per acre.",
      pests: "Spray neem oil to prevent aphids.",
      season: "Sow in November.",
      harvest: "Harvest when grains are hard and yellow.",
    },
    Bean: {
      soil: "Well-drained sandy loam soil.",
      watering: "Irrigate every 7 days.",
      fertilizer: "Apply NPK 20:60:20 kg/acre.",
      pests: "Use sticky traps to prevent bean fly.",
      season: "Plant Feb–March and June–July.",
      harvest: "Harvest pods when tender and green.",
    },
    "Bitter Gourd": {
      soil: "Fertile loamy soil with pH 6–7.",
      watering: "Water every 5–6 days.",
      fertilizer: "Apply NPK 30:20:30 kg/acre.",
      pests: "Control fruit fly using pheromone traps.",
      season: "Sow in summer or rainy season.",
      harvest: "Harvest 60–70 days after sowing when fruits are tender.",
    },
    "Black Bean": {
      soil: "Loamy soil with good drainage.",
      watering: "Irrigate every 7–10 days.",
      fertilizer: "Apply NPK 20:40:20 kg/acre.",
      pests: "Use neem spray for aphids.",
      season: "Plant in Feb–March.",
      harvest: "Harvest when pods are mature and dry.",
    },
    Brinjal: {
      soil: "Rich loamy soil with pH 6–7.",
      watering: "Water every 4–5 days.",
      fertilizer: "Apply NPK 60:30:30 kg/acre.",
      pests: "Use traps for fruit borer and spray neem oil.",
      season: "Plant Jan–Feb or June–July.",
      harvest: "Harvest fruits 60–70 days after transplanting.",
    },
    Cabbage: {
      soil: "Fertile loamy soil rich in nitrogen.",
      watering: "Irrigate every 7 days.",
      fertilizer: "Apply NPK 40:20:20 kg/acre.",
      pests: "Prevent cabbage looper using neem oil spray.",
      season: "Plant in Sept–Nov.",
      harvest: "Harvest when heads are firm and compact.",
    },
  };

  const data = tipsDB[crop];

  // dynamic YouTube tutorial link for each crop
  const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${crop} cultivation tips in Hindi`
  )}`;

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">{t("cultivationTips.title")}</h1>
      <p className="text-gray-500 mb-6">{t("cultivationTips.subtitle", "Best practices to grow healthy crops")}</p>

      {/* Crop Picker */}
      <label className="block text-gray-600 mb-2 font-medium">{t("cultivationTips.selectCrop")}</label>
      <select
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        className="w-full border p-3 rounded-lg bg-white shadow"
      >
        {crops.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Tips Section */}
      {data && (
        <div className="mt-6 space-y-4">
          <TipCard title={`🌱 ${t("cultivationTips.soilPrep")}`} text={data.soil} />
          <TipCard title={`💧 ${t("cultivationTips.watering", "Watering Schedule")}`} text={data.watering} />
          <TipCard title={`🌾 ${t("cultivationTips.fertilizer")}`} text={data.fertilizer} />
          <TipCard title={`🐛 ${t("cultivationTips.pestPrevention", "Pest Prevention")}`} text={data.pests} />
          <TipCard title={`🌤️ ${t("cultivationTips.season", "Suitable Season")}`} text={data.season} />
          <TipCard title={`🧺 ${t("cultivationTips.harvesting")}`} text={data.harvest} />

          {/* Video tutorial card */}
          <VideoCard crop={crop} videoUrl={videoUrl} t={t} />
        </div>
      )}
    </div>
  );
}

// Reusable text card
function TipCard({ title, text }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>
      <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

// Video tutorial card
function VideoCard({ crop, videoUrl, t }) {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-blue-800">
          🎞️ {t ? t("cultivationTips.videoTutorial") : "Video tutorial"}
        </h2>
        <p className="text-sm text-blue-700">
          {t ? t("cultivationTips.watchOn", { crop }) : `Watch ${crop} cultivation tips on YouTube`}
        </p>
      </div>
      <a
        href={videoUrl}
        target="_blank"
        rel="noreferrer"
        className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
      >
        {t ? t("cultivationTips.openVideo", "Open video") : "Open video"}
      </a>
    </div>
  );
}
