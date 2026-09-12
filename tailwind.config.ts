import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#05060A",
        surface: {
          DEFAULT: "#0B0F18",
          elevated: "#121826",
          hover: "#1A2234",
          border: "#1E293B",
        },
        primary: {
          DEFAULT: "#7C3AED",
          light: "#9333EA",
          dark: "#6D28D9",
        },
        secondary: {
          DEFAULT: "#06B6D4",
          light: "#22D3EE",
          dark: "#0891B2",
        },
        rpg: {
          gold: "#F59E0B",
          xp: "#8B5CF6",
          health: "#EF4444",
          mana: "#3B82F6",
          streak: "#F97316",
          success: "#22C55E",
          intellect: "#38BDF8",
          strength: "#F87171",
          discipline: "#A855F7",
          vitality: "#4ADE80",
          creativity: "#FBBF24",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(6, 182, 212, 0.6))" },
          "50%": { opacity: "0.7", filter: "drop-shadow(0 0 5px rgba(6, 182, 212, 0.2))" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
