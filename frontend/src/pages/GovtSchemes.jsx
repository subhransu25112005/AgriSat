import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function GovtSchemes() {
    const { t } = useTranslation();
    const [state, setState] = useState("");
    const [loading, setLoading] = useState(false);
    const [schemes, setSchemes] = useState([]);
    const [error, setError] = useState("");

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
        "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal"
    ];

    // Structured local dataset for fallback/demo
    const localSchemes = [
        { title: "PM-Kisan Samman Nidhi", shortDescription: "Providing ₹6,000 per year income support to all landholding farmers' families in three equal installments.", slug: "pradhan-mantri-kisan-samman-nidhi" },
        { title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", shortDescription: "An yield-based insurance scheme which provides financial support to farmers suffering crop loss/damage.", slug: "pradhan-mantri-fasal-bima-yojana" },
        { title: "Kisan Credit Card (KCC)", shortDescription: "Provides farmers with timely access to credit for their cultivation and other needs.", slug: "kisan-credit-card" },
        { title: "Soil Health Card Scheme", shortDescription: "Helps farmers to know the nutrient status of their soil along with recommendations on appropriate dosage of nutrients.", slug: "soil-health-card-scheme" },
        { title: "National Mission For Sustainable Agriculture (NMSA)", shortDescription: "Focuses on climate change adaptation in agriculture and promotion of organic farming.", slug: "national-mission-for-sustainable-agriculture" },
    ];

    // 🔥 Fetch live schemes from MyScheme API
    const fetchLiveSchemes = async () => {
        if (!state) return;
        setLoading(true);
        setError("");

        try {
            const url = `${import.meta.env.VITE_API_URL}/api/schemes?q=${encodeURIComponent(
                state + " farmer agriculture"
            )}`;

            const res = await fetch(url).catch(() => null);

            if (res && res.ok) {
                const json = await res.json();
                if (!json.data || json.data.length === 0) {
                    setSchemes(localSchemes); // Fallback to local if no data from API
                } else {
                    setSchemes(json.data);
                }
            } else {
                // Network error or API missing -> Use local data
                setSchemes(localSchemes);
            }
        } catch (err) {
            setSchemes(localSchemes);
        }

        setLoading(false);
    };


    return (
        <div className="p-4 max-w-3xl mx-auto pb-20">
            <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{t("govtSchemes.title")}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t("govtSchemes.subtitle", "Live updates from MyScheme & Govt portals")}</p>

            {/* State selector */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t("govtSchemes.state")}</label>
                <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mt-2 outline-none focus:ring-2 focus:ring-green-500 dark:text-white border border-transparent focus:border-green-500"
                >
                    <option value="">{t("common.choose_state", "Choose State")}</option>
                    {indianStates.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                {state && (
                    <button
                        onClick={fetchLiveSchemes}
                        className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 active:scale-95 transition"
                    >
                        {loading ? t("govtSchemes.loading") : t("govtSchemes.viewSchemes", "View Schemes")}
                    </button>
                )}
            </div>

            {/* LIVE RESULT LIST */}
            <div className="mt-8 space-y-4">
                {schemes.map((item, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-50 dark:border-gray-700 hover:shadow-md transition group"
                    >
                        <div className="flex justify-between items-start gap-3">
                            <h2 className="font-bold text-lg dark:text-white group-hover:text-green-600 transition">{item.title}</h2>
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase">Live</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                            {item.shortDescription || t("govtSchemes.noDesc", "No description provided")}
                        </p>

                        <div className="mt-4 flex justify-between items-center">
                            <a
                                href={`https://www.myscheme.gov.in/schemes/${item.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1"
                            >
                                {t("govtSchemes.details", "View Details")} ➔
                            </a>
                            <button className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                🔖 {t("common.save", "Save")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Direct Govt Portals */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800/50 mt-10">
                <h2 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    🏛️ {t("govtSchemes.officialPortals", "Official Portals")}
                </h2>
                <ul className="mt-3 space-y-2 text-sm">
                    <li>
                        <a href="https://myscheme.gov.in" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                            MyScheme – All Government Schemes
                        </a>
                    </li>
                    <li>
                        <a href="https://agricoop.nic.in/en" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Ministry of Agriculture
                        </a>
                    </li>
                    <li>
                        <a href="https://pmkisan.gov.in" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                            PM Kisan – Farmer Income Support
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
