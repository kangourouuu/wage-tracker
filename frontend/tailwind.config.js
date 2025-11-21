/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#1f2937", // Dark gray/blue background
        surface: "#374151", // Slightly lighter for cards
        primary: {
          DEFAULT: "#6366f1", // Indigo
          dark: "#4f46e5",
          light: "#818cf8",
        },
        secondary: {
          DEFAULT: "#8b5cf6", // Purple
          dark: "#7c3aed",
          light: "#a78bfa",
        },
        success: {
          DEFAULT: "#10b981", // Emerald
          dark: "#059669",
        },
        danger: {
          DEFAULT: "#ef4444", // Red
          dark: "#dc2626",
        },
        text: {
          primary: "#f9fafb",
          secondary: "#9ca3af",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        "gradient-surface":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        neon: "0 0 10px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
