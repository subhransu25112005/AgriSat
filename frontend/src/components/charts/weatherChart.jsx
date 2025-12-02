// src/components/Charts/WeatherChart.jsx
import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export default function WeatherChart({ forecast=[] , height=200 }) {
  const labels = forecast.map(f => f.dt_txt.split(" ")[0]);
  const temps = forecast.map(f => f.temp);
  const rain = forecast.map(f => f.pop ?? 0);

  const data = {
    labels,
    datasets: [
      { type: 'line', label: 'Temp (°C)', data: temps, yAxisID: 'y1', borderColor: '#0F7A3A', backgroundColor: 'rgba(15,122,58,0.08)', tension: 0.3, fill: true },
      { type: 'bar', label: 'Rain %', data: rain.map(v=>v*100), yAxisID: 'y', backgroundColor: 'rgba(30,144,255,0.6)' }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { position: 'left', ticks: { color:'#374151' } },
      y1: { position: 'right', grid: { drawOnChartArea:false }, ticks: { color:'#374151' } }
    },
    plugins: { legend: { display: false }, tooltip: { mode:'index', intersect:false } }
  };

  return <div style={{height}}><Bar data={data} options={options} /></div>;
}
