import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PestsDiseases() {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const CX = import.meta.env.VITE_GOOGLE_CX_ID;

    const searchGoogle = async () => {
        if (!API_KEY || !CX) {
            console.warn("⚠️ Google Custom Search APIs (VITE_GOOGLE_API_KEY / VITE_GOOGLE_CX_ID) are missing from frontend .env!");
        }
        if (!query.trim()) return;

        setLoading(true);

        try {
            const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
                query + " plant disease treatment"
            )}&key=${API_KEY}&cx=${CX}`;

            const res = await fetch(url);
            const data = await res.json();

            console.log("GOOGLE DATA:", data);

            setResults(data.items || []);
        } catch (err) {
            console.error("Google Search Error:", err);
        }

        setLoading(false);
    };


    return (
        <div className="p-5 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-3">{t("pests.title")}</h1>
            <p className="text-gray-600 mb-5">{t("pests.subtitle", "Identify & get treatments instantly")}</p>

            {/* Search box */}
            <div className="bg-gray-100 p-3 rounded-xl flex items-center">
                <input
                    className="bg-transparent w-full outline-none text-lg"
                    placeholder={t("pests.search")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchGoogle()}
                />
                <button
                    onClick={searchGoogle}
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl ml-3"
                >
                    {t("pests.searchBtn", "Search")}
                </button>
            </div>
            <div className="mt-6">
                {loading && (
                    <p className="text-gray-600 text-sm">{t("common.loading")}</p>
                )}

                {!loading && results.length === 0 && (
                    <p className="text-gray-500 text-sm">{t("pests.noResults", "No results yet")}</p>
                )}

                <div className="space-y-4 mt-4">
                    {results.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-xl shadow bg-white flex gap-4"
                        >
                            {/* Thumbnail */}
                            {item.pagemap?.cse_thumbnail?.[0]?.src ? (
                                <img
                                    src={item.pagemap.cse_thumbnail[0].src}
                                    className="w-20 h-20 rounded object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded" />
                            )}

                            {/* Texts */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-600">
                                    {item.snippet}
                                </p>

                                <a
                                    href={item.link}
                                    target="_blank"
                                    className="text-blue-600 text-sm font-semibold mt-2 inline-block"
                                >
                                    {t("pests.readMore", "Read more")} →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Loading */}
            {loading && <p className="text-center mt-5">{t("common.loading")}</p>}

            {/* Results */}
            <div className="mt-6 space-y-5">
                {results.map((item, i) => (
                    <div key={i} className="bg-white shadow-md p-4 rounded-xl">
                        <h2 className="font-bold text-lg">{item.title}</h2>
                        <p className="text-gray-600 mt-1">{item.snippet}</p>

                        {item.pagemap?.cse_image && (
                            <img
                                src={item.pagemap.cse_image[0].src}
                                alt="img"
                                className="w-full h-48 object-cover rounded-xl mt-3"
                            />
                        )}

                        <a
                            href={item.link}
                            target="_blank"
                            className="text-blue-600 font-semibold mt-3 block"
                        >
                            {t("pests.readMore", "Read more")} →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
