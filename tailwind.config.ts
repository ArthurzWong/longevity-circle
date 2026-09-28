import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F5EF",
        parchment: "#F0EDE4",
        mist: "#E5E1D5",
        ink: {
          DEFAULT: "#1B2A22",
          soft: "#3E4F46",
          faint: "#68786E",
        },
        sage: {
          50: "#F0F5F1",
          100: "#DFEBE3",
          200: "#C2D8C9",
          300: "#9BBFA8",
          400: "#6E9C81",
          500: "#4E7D63",
          600: "#3D6650",
          700: "#315241",
          800: "#263F34",
          900: "#1B2A22",
        },
        gold: {
          50: "#FBF6EC",
          100: "#F5EBD6",
          300: "#E3C88F",
          400: "#D3B071",
          500: "#C49A58",
          600: "#A87F42",
          700: "#86642F",
        },
        clay: {
          500: "#C0654A",
          600: "#A5523A",
          100: "#F6E3DC",
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,42,34,0.04), 0 6px 20px -8px rgba(27,42,34,0.10)",
        lift: "0 2px 6px rgba(27,42,34,0.06), 0 20px 44px -16px rgba(27,42,34,0.22)",
        nav: "0 -2px 24px -8px rgba(27,42,34,0.18), 0 1px 2px rgba(27,42,34,0.06)",
        glow: "0 8px 28px -10px rgba(61,102,80,0.55)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.28)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "float-slow": "float-slow 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
