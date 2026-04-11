import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function KnowledgeHub() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // All your crops with short tips
  const CROPS = [
    {
      name: "Grapes",
      category: "Fruit",
      image: "/assets/illustrations/grapes.png",
      tips: [
        "Well-drained sandy loam soil, pH 6.5–7.5.",
        "Irrigate every 5–7 days; avoid waterlogging.",
        "Regular pruning improves yield."
      ],
    },
    {
      name: "Papaya",
      category: "Fruit",
      image: "/assets/illustrations/papaya.png",
      tips: [
        "Light loamy soil rich in organic matter.",
        "Irrigate every 7–10 days depending on season.",
        "Remove infected leaves to control viral diseases."
      ],
    },
    {
      name: "Olive",
      category: "Fruit",
      image: "/assets/illustrations/olive.png",
      tips: [
        "Deep well-drained loamy soil, pH 7–8.5.",
        "Light irrigation every 15–20 days.",
        "Prune trees to maintain open canopy."
      ],
    },
    {
      name: "Rose",
      category: "Flower",
      image: "/assets/illustrations/rose.png",
      tips: [
        "Fertile sandy loam, pH 6–7.",
        "Water every 3–4 days; avoid standing water.",
        "Regular deadheading encourages more blooms."
      ],
    },
    {
      name: "Sugarcane",
      category: "Cash Crop",
      image: "/assets/illustrations/sugarcane.png",
      tips: [
        "Deep loamy soil with high organic matter.",
        "Irrigate every 10–12 days.",
        "Control early shoot borer with light traps."
      ],
    },
    {
      name: "Almond",
      category: "Nut",
      image: "/assets/illustrations/almond.png",
      tips: [
        "Well-drained loamy to sandy soil.",
        "Irrigate during flowering and nut filling stage.",
        "Prune to maintain good branch structure."
      ],
    },
    {
      name: "Apple",
      category: "Fruit",
      image: "/assets/illustrations/apple.png",
      tips: [
        "Deep loam soil rich in organic matter.",
        "Irrigate every 7–10 days in dry period.",
        "Use proper thinning for better fruit size."
      ],
    },
    {
      name: "Apricot",
      category: "Fruit",
      image: "/assets/illustrations/apricot.png",
      tips: [
        "Sandy loam to loam soil, pH 6–7.",
        "Avoid waterlogging; provide light irrigations.",
        "Harvest when fruits turn yellow-orange."
      ],
    },
    {
      name: "Banana",
      category: "Fruit",
      image: "/assets/illustrations/banana.png",
      tips: [
        "Rich loamy soil with high organic matter.",
        "Constant soil moisture is important.",
        "Provide staking/support to avoid lodging."
      ],
    },
    {
      name: "Barley",
      category: "Cereal",
      image: "/assets/illustrations/barley.png",
      tips: [
        "Sandy loam soil, pH 6–7.5.",
        "Light irrigation at tillering and grain filling.",
        "Timely weeding improves yield."
      ],
    },
    {
      name: "Bean",
      category: "Vegetable",
      image: "/assets/illustrations/bean.png",
      tips: [
        "Well-drained sandy loam soil.",
        "Irrigate every 5–7 days.",
        "Use staking for climber types."
      ],
    },
    {
      name: "Bitter Gourd",
      category: "Vegetable",
      image: "/assets/illustrations/bitter-gourd.png",
      tips: [
        "Fertile loamy soil, pH 6–7.",
        "Provide trellis for better fruit shape.",
        "Use pheromone traps for fruit fly."
      ],
    },
    {
      name: "Black Bean",
      category: "Pulse",
      image: "/assets/illustrations/black-bean.png",
      tips: [
        "Loamy soil with good drainage.",
        "Avoid over-irrigation to prevent root rot.",
        "Crop rotation helps manage soil diseases."
      ],
    },
    {
      name: "Brinjal",
      category: "Vegetable",
      image: "/assets/illustrations/brinjal.png",
      tips: [
        "Rich loamy soil, pH 6–7.",
        "Irrigate every 4–5 days.",
        "Use traps and neem spray for fruit borer."
      ],
    },
    {
      name: "Cabbage",
      category: "Vegetable",
      image: "/assets/illustrations/cabbage.png",
      tips: [
        "Fertile loamy soil rich in nitrogen.",
        "Irrigate every 7 days.",
        "Tight, compact heads indicate right harvest time."
      ],
    },
  ];

  const categories = ["All", "Fruit", "Vegetable", "Flower", "Cereal", "Cash Crop", "Nut", "Pulse"];

  // Helper: dynamic links so they always have real content
  const getVideoUrl = (cropName) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(
      `${cropName} cultivation guide in Hindi`
    )}`;

  const getPdfUrl = (cropName) =>
    `https://www.google.com/search?q=${encodeURIComponent(
      `${cropName} cultivation pdf`
    )}`;

  const filtered = CROPS.filter((c) => {
    const matchName =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "All" || c.category === categoryFilter;
    return matchName && matchCategory;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800">{t("knowledgeHub.title")}</h1>
      <p className="text-slate-600 mb-4">{t("knowledgeHub.subtitle", "Learn crop practices, watch tutorials, and find detailed guides.")}</p>

      {/* Search */}
      <input
        type="text"
        placeholder={t("knowledgeHub.search", "Search crop (e.g. Grapes, Banana)…")}
        className="w-full p-2 border rounded-lg mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm border ${categoryFilter === cat
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-700 border-slate-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 && (
        <p className="text-center text-slate-500 mt-6">
          {t("knowledgeHub.noFound", "No crops found. Try another name.")}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((crop) => (
          <div
            key={crop.name}
            className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition"
          >
            {/* Image */}
            {crop.image ? (
              <img
                src={crop.image}
                alt={crop.name}
                className="h-28 mx-auto mb-3 object-contain"
              />
            ) : (
              <div className="h-28 mb-3 flex items-center justify-center bg-slate-100 rounded-lg text-slate-400 text-sm">
                {t("knowledgeHub.noImage", "No image")}
              </div>
            )}

            {/* Title */}
            <h2 className="text-lg font-bold text-slate-800 text-center">
              {crop.name}
            </h2>
            <p className="text-xs text-center text-slate-500 mb-2">
              {crop.category}
            </p>

            {/* Tips */}
            <ul className="text-slate-700 text-sm list-disc ml-4 mt-2">
              {crop.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>

            {/* Actions */}
            <div className="mt-4 flex justify-between gap-2">
              <a
                href={getVideoUrl(crop.name)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
              >
                ▶ {t("knowledgeHub.watchVideos", "Watch videos")}
              </a>
              <a
                href={getPdfUrl(crop.name)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
              >
                📄 {t("knowledgeHub.pdfGuides", "PDF guides")}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
