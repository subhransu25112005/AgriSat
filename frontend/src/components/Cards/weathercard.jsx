import React from "react";
import { Link } from "react-router-dom";

export default function weatherCard({ location, weather }) {
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
          <p className="text-sm text-gray-500">
            {weather?.current?.description || "Loading..."}
          </p>
        </div>

        {/* Right */}
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600 leading-none">
            {weather?.current?.temp
              ? Math.round(weather.current.temp) + "°C"
              : "--°C"}
          </p>

          {/* Uses OpenWeather icon LIVE (no PNG files needed) */}
          <img
            src={`https://openweathermap.org/img/wn/${weather?.current?.icon || "01d"}@2x.png`}
            alt="weather"
            className="w-12 h-12"
          />
        </div>

      </div>
    </Link>
  );
}
