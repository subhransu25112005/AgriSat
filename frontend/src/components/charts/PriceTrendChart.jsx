import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PriceTrendChart({ t }) {
  const chartData = {
    labels: ["03 Apr", "04 Apr", "05 Apr", "06 Apr", "07 Apr", "08 Apr", "09 Apr"],
    datasets: [
      {
        label: t("marketPrices.trend_label", "Price Trend (Avg)"),
        data: [2100, 2250, 2200, 2400, 2350, 2500, 2450],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Line 
        data={chartData} 
        options={{ 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: false } }
        }} 
      />
    </div>
  );
}
