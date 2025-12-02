import React, { useState } from "react";

export default function GovtSchemes() {
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

    // 🔥 Fetch live schemes from MyScheme API
    const fetchLiveSchemes = async () => {
        if (!state) return;
        setLoading(true);
        setError("");

        try {
            const url = `http://localhost:5000/api/schemes?q=${encodeURIComponent(
                state + " farmer agriculture"
            )}`;

            const res = await fetch(url);
            const json = await res.json();

            console.log("LIVE SCHEMES:", json);

            if (!json.data || json.data.length === 0) {
                setError("No schemes found for this state.");
                setSchemes([]);
            } else {
                setSchemes(json.data);
            }
        } catch (err) {
            setError("Failed to load schemes.");
        }

        setLoading(false);
    };


    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Government Schemes</h1>
            <p className="text-gray-600 mb-6">Live updates from MyScheme & Govt portals</p>

            {/* State selector */}
            <label className="font-medium text-gray-800">Select State</label>
            <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-gray-100 p-3 rounded-lg mt-2"
            >
                <option value="">Choose State</option>
                {indianStates.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>

            {/* Fetch button */}
            {state && (
                <button
                    onClick={fetchLiveSchemes}
                    className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-semibold"
                >
                    {loading ? "Loading..." : "View Schemes"}
                </button>
            )}

            {/* Errors */}
            {error && (
                <p className="text-red-600 font-semibold mt-4">{error}</p>
            )}

            {/* LIVE RESULT LIST */}
            <div className="mt-6 space-y-4">
                {schemes.map((item, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl p-4 shadow-md border hover:shadow-lg transition"
                    >
                        <h2 className="font-bold text-lg">{item.title}</h2>
                        <p className="text-gray-600 mt-1">
                            {item.shortDescription || "No description provided"}
                        </p>

                        <a
                            href={`https://www.myscheme.gov.in/schemes/${item.slug}`}
                            target="_blank"
                            className="text-blue-600 font-semibold mt-2 inline-block"
                        >
                            View details →
                        </a>
                    </div>
                ))}
            </div>

            {/* Direct Govt Portals */}
            <div className="bg-blue-50 rounded-xl p-4 border mt-8">
                <h2 className="font-semibold">Official Portals</h2>
                <ul className="list-disc ml-5 mt-2 text-blue-700">
                    <li>
                        <a href="https://myscheme.gov.in" target="_blank">
                            MyScheme – All Government Schemes
                        </a>
                    </li>
                    <li>
                        <a href="https://agricoop.nic.in/en" target="_blank">
                            Ministry of Agriculture
                        </a>
                    </li>
                    <li>
                        <a href="https://pmkisan.gov.in" target="_blank">
                            PM Kisan – Farmer Income Support
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
