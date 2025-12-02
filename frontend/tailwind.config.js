export default {
  darkMode:"class",
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx,mdx}",   // Fix: include ALL React file types
  ],

theme: {
    extend: {
      colors: {
        brand: "#0F7A3A",
        brandAccent: "#1FA65A",
        lightbg: "#F4F8F5",
        softGreen: "#E9F9EE",
        darkText: "#1A1F1C",
        grayText: "#4B5563"
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
        innerCard: "inset 0 0 8px rgba(0,0,0,0.02)"
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-in-out",
        slideUp: "slideUp 0.35s ease",
        scaleIn: "scaleIn 0.3s ease",
        pulseSoft: "pulseSoft 1.5s ease infinite"
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
          "50%": { transform: "scale(1.03)", opacity: 0.95 },
          "100%": { transform: "scale(1)", opacity: 1 }
        }
      }
    }
  },
  plugins: []
};