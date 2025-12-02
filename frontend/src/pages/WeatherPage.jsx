import React, { useEffect, useState } from "react";
import WeatherGraph from "../components/weather/WeatherGraph";
import AQICard from "../components/weather/AQICard";

export default function WeatherPage() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);

  // Your city
  const lat = 20.2961;
  const lon = 85.8245;

  const API_KEY = "67cc56c42c1b4c48c62a08555d52151d";

  useEffect(() => {
    async function load() {
      try {
        // CURRENT WEATHER
        const now = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        ).then((r) => r.json());

        // 5-DAY / 3-HOUR FORECAST
        const fc = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        ).then((r) => r.json());

        // AIR QUALITY
        const aq = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        ).then((r) => r.json());

        const dailyData = fc.list.filter((_, i) => i % 8 === 0).slice(0, 6);
        const hourlyData = fc.list.slice(0, 10); // 10 hours

        setCurrent(now);
        setForecast(dailyData);
        setHourly(hourlyData);
        setAqi(aq.list[0]);
        setLoading(false);
      } catch (e) {
        console.log("Weather error:", e);
      }
    }

    load();
  }, []);

  if (loading) return <div className="text-center p-10 text-lg">Loading…</div>;

  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 p-4 sm:p-8">

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        {current.name} Weather
      </h1>

      {/* CURRENT CARD */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg mb-8 flex justify-between items-center border">
        <div>
          <div className="text-5xl sm:text-6xl font-bold text-gray-900">
            {Math.round(current.main.temp)}°C
          </div>
          <div className="capitalize text-gray-700 text-lg">
            {current.weather[0].description}
          </div>
          <div className="mt-1 text-gray-500">
            Feels like {Math.round(current.main.feels_like)}°C
          </div>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
          className="w-24 sm:w-32"
        />
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { label: "Humidity", value: current.main.humidity + "%" },
          { label: "Wind", value: current.wind.speed + " m/s" },
          { label: "Pressure", value: current.main.pressure + " hPa" },
          { label: "Visibility", value: current.visibility / 1000 + " km" },
          { label: "Sunrise", value: sunrise },
          { label: "Sunset", value: sunset },
        ].map((m, i) => (
          <div
            key={i}
            className="bg-white/70 p-4 rounded-xl text-center border shadow-sm"
          >
            <div className="text-gray-500 text-sm">{m.label}</div>
            <div className="text-lg font-semibold text-gray-800 mt-1">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* AQI */}
      <AQICard aqi={aqi} />

      {/* HOURLY TEMP GRAPH */}
      <WeatherGraph hourly={hourly} />

      {/* NEXT 6 DAYS */}
      <h2 className="text-xl font-semibold mb-3 mt-10 text-gray-800">
        Next 6 Days
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {forecast.map((d, i) => (
          <div
            key={i}
            className="bg-white/80 p-4 rounded-xl border shadow text-center"
          >
            <div className="text-gray-600 text-sm font-medium">
              {new Date(d.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </div>

            <img
              src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`}
              className="w-12 mx-auto"
            />

            <div className="font-bold text-gray-900 text-lg">
              {Math.round(d.main.temp)}°C
            </div>
          </div>
        ))}
      </div>

      {/* SPRAYING TIME */}
      <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-800">
        Spraying Time (Next Few Hours)
      </h2>

      <div className="space-y-3 mb-10">
        {hourly.map((h, i) => {
          const temp = h.main.temp;

          let status =
            temp >= 18 && temp <= 28
              ? "Optimal"
              : temp <= 32
              ? "Moderate"
              : "Unfavourable";

          let color =
            status === "Optimal"
              ? "bg-green-100 text-green-800"
              : status === "Moderate"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800";

          return (
            <div
              key={i}
              className={`p-4 rounded-xl flex justify-between shadow ${color}`}
            >
              <div>
                {new Date(h.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="font-bold">{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
