export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#0F7A3A",
        brandAccent: "#1FA65A",
        neonGreen: "#00ff88",
        darkForest: "#0B130D",
        earthyBlack: "#151C17",
        lightbg: "#F4F8F5",
        softGreen: "#E9F9EE",
        darkText: "#1A1F1C",
        grayText: "#E0E5E1"
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "ui-sans-serif", "system-ui"]
      },
      borderRadius: {
        xl: "16px",
        xxl: "22px"
      },
      boxShadow: {
        card: "0 4px 14px rgba(0,0,0,0.08)",
        soft: "0 2px 8px rgba(0,0,0,0.06)",
        innerCard: "inset 0 0 8px rgba(0,0,0,0.02)",
        neon: "0 0 15px rgba(0, 255, 136, 0.4)",
        neonStrong: "0 0 25px rgba(0, 255, 136, 0.6)"
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-in-out",
        slideUp: "slideUp 0.35s ease",
        scaleIn: "scaleIn 0.3s ease",
        pulseSoft: "pulseSoft 2s ease infinite",
        glowPulse: "glowPulse 3s infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.92)" },
          "100%": { opacity: 1, transform: "scale(1)" }
        },
        pulseSoft: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.02)", opacity: 0.95 },
          "100%": { transform: "scale(1)", opacity: 1 }
        },
        glowPulse: {
          "from": { boxShadow: "0 0 10px rgba(0, 255, 136, 0.2)" },
          "to": { boxShadow: "0 0 25px rgba(0, 255, 136, 0.6)" }
        }
      }
    }
  },
  plugins: []
};