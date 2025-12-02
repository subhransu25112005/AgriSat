import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default function WeatherGraph({ hourly }) {
  const labels = hourly.map((h) =>
    new Date(h.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const temps = hourly.map((h) => h.main.temp);

  return (
    <div className="bg-white/80 p-5 rounded-2xl shadow-lg mt-8">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Temperature (Next Few Hours)
      </h2>

      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Temp",
              data: temps,
              tension: 0.4,
              borderColor: "#0077ff",
              borderWidth: 3,
              pointRadius: 3,
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            y: { beginAtZero: false },
          },
          plugins: { legend: { display: false } },
        }}
      />
    </div>
  );
}
