import React from "react";
import { Link } from "react-router-dom";

export default function WeatherCard({ location, weather }) {
  // Graceful failure fallback using optional chaining
  const temperature = weather?.current?.temp ? Math.round(weather.current.temp) + "°C" : "--°C";
  const desc = weather?.current?.description || "Loading...";
  const icon = weather?.current?.icon || "01d";

  const isLoaded = !!weather?.current?.temp;

  return (
    <Link to="/weather">
      <div className="flex items-center justify-between bg-white border 
                      rounded-2xl p-4 shadow-sm active:scale-[0.98] 
                      transition-all duration-150 cursor-pointer">

        {/* Left */}
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {location || "Your Field"}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {desc}
          </p>
        </div>

        {/* Right Portion */}
        <div className="flex items-center gap-4 text-right">
          <p className={`text-3xl font-bold leading-none tracking-tighter ${isLoaded ? 'text-blue-600' : 'text-gray-400'}`}>
            {temperature}
          </p>

          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="weather"
            className={`w-12 h-12 transition-all ${!isLoaded ? 'opacity-50 grayscale' : 'opacity-100'}`}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>

      </div>
    </Link>
  );
}
