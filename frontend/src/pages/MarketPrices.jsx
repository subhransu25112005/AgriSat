import React, { useState } from "react";

export default function MarketPrices() {
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState([]);
  const [error, setError] = useState("");

  const states = [
    "Odisha", "Maharashtra", "Gujarat", "Punjab", "Karnataka",
    "Andhra Pradesh", "Tamil Nadu", "Bihar", "UP", "MP"
  ];

  const fetchPrices = async () => {
    if (!state) return alert("Please select a state");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/mandi?state=${state}`);
      const data = await res.json();

      console.log("PRICE DATA:", data);

      if (!data.records || data.records.length === 0) {
        setError("No market data available for this state.");
        setPrices([]);
      } else {
        setPrices(data.records);
      }

    } catch (err) {
      setError("Error fetching market prices.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Market Prices</h1>
      <p className="text-gray-600 mb-6">Check latest mandi rates for your crop</p>

      {/* Select State */}
      <label className="font-medium">Select State</label>
      <select
        className="w-full mt-2 p-3 border rounded-lg"
        value={state}
        onChange={(e) => setState(e.target.value)}
      >
        <option value="">Choose State</option>
        {states.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button
        onClick={fetchPrices}
        className="w-full bg-green-600 text-white py-3 rounded-xl mt-4 font-semibold"
      >
        Get Prices
      </button>

      {/* Loading */}
      {loading && <p className="text-center mt-4">Fetching prices...</p>}

      {/* Error */}
      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded-lg mt-4">{error}</p>
      )}

      {/* Results */}
      <div className="mt-6 space-y-4">
        {prices.map((item, i) => (
          <div key={i} className="p-4 shadow rounded-xl bg-white">
            <h2 className="font-bold text-lg">{item.commodity}</h2>
            <p className="text-sm text-gray-600">{item.market}, {item.state}</p>

            <div className="mt-2">
              <p><span className="font-semibold">Min Price:</span> ₹{item.min_price}</p>
              <p><span className="font-semibold">Max Price:</span> ₹{item.max_price}</p>
              <p><span className="font-semibold">Modal Price:</span> ₹{item.modal_price}</p>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Updated: {item.arrival_date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
