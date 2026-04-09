import { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function WeatherChart({ hourly = [] }) {
  if (!hourly.length) return null;

  const labels = hourly.map(h =>
    new Date(h.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const temps = hourly.map(h => Math.round(h.main.temp));

  const makeGradient = (ctx) => {
    if (!ctx?.chart?.chartArea) return "transparent";
    const { top, bottom } = ctx.chart.chartArea;
    const g = ctx.chart.ctx.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0,   "rgba(52, 211, 153, 0.32)");
    g.addColorStop(0.5, "rgba(16, 185, 129, 0.12)");
    g.addColorStop(1,   "rgba(16, 185, 129, 0)");
    return g;
  };

  const makeLineGradient = (ctx) => {
    if (!ctx?.chart?.chartArea) return "#34d399";
    const { left, right } = ctx.chart.chartArea;
    const g = ctx.chart.ctx.createLinearGradient(left, 0, right, 0);
    g.addColorStop(0,   "#34d399");
    g.addColorStop(0.5, "#38bdf8");
    g.addColorStop(1,   "#818cf8");
    return g;
  };

  const data = {
    labels,
    datasets: [{
      data: temps,
      fill: true,
      tension: 0.42,
      borderWidth: 2.5,
      borderColor: makeLineGradient,
      backgroundColor: makeGradient,
      pointRadius: 0,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: "#34d399",
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 2,
    }]
  };

  const options = {
    maintainAspectRatio: false,
    animation: { duration: 1200, easing: "easeInOutCubic" },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(2,8,20,0.92)",
        titleColor: "rgba(255,255,255,0.45)",
        bodyColor: "#fff",
        borderColor: "rgba(52,211,153,0.3)",
        borderWidth: 1,
        padding: { x: 14, y: 10 },
        cornerRadius: 12,
        displayColors: false,
        titleFont: { size: 10, weight: "800", family: "inherit" },
        bodyFont: { size: 16, weight: "900", family: "inherit" },
        callbacks: {
          title: ctx => ctx[0].label,
          label: ctx => `${ctx.parsed.y}°C`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "rgba(255,255,255,0.3)",
          font: { weight: "700", size: 10 },
          maxRotation: 0
        }
      },
      y: {
        grid: {
          color: "rgba(255,255,255,0.04)",
          drawBorder: false
        },
        border: { display: false },
        ticks: {
          color: "rgba(255,255,255,0.3)",
          font: { weight: "700", size: 10 },
          callback: v => `${v}°`
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}
