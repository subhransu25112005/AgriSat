// src/components/Charts/NDVILineChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function NDVILineChart({ data=[] , height=220}) {
  const labels = data.map(d => d.start.split("T")[0] || d.start);
  const values = data.map(d => d.mean ?? null);

  const cfg = {
    labels,
    datasets: [
      {
        label: "NDVI",
        data: values,
        borderColor: "#0F7A3A",
        backgroundColor: "rgba(15,122,58,0.08)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "#1FA65A"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, backgroundColor: '#111827', titleColor: '#fff', bodyColor: '#fff' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#374151' } },
      y: { min: -0.1, max: 1.0, ticks: { color:'#374151' }, grid: { color: 'rgba(15,122,58,0.06)' } }
    }
  };

  return (
    <div style={{height}} className="fade-in">
      <Line data={cfg} options={options} />
    </div>
  );
}
