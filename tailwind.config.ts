import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f8ff",
          100: "#eef2ff",
          200: "#dbe4ff",
          300: "#b8c9ff",
          400: "#89a3ff",
          500: "#5b7cff",
          600: "#3a58ff",
          700: "#2b3fe6",
          800: "#2436b8",
          900: "#202f8f",
          950: "#151b4a"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(91,124,255,0.15), 0 10px 40px rgba(20, 20, 60, 0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
