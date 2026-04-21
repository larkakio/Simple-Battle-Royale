import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          cyan: "#00f5ff",
          magenta: "#ff00aa",
          amber: "#ffaa00",
        },
        cyber: {
          bg: "#050510",
          surface: "#0a0a1a",
        },
      },
      fontFamily: {
        sans: ["var(--font-orbitron)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 245, 255, 0.35)",
      },
      animation: {
        "neon-pulse": "neon-pulse 2.4s ease-in-out infinite",
        glitch: "glitch 3s ease-in-out infinite",
      },
      keyframes: {
        "neon-pulse": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.85", filter: "brightness(1.15)" },
        },
        glitch: {
          "0%, 90%, 100%": { transform: "translate(0)" },
          "92%": { transform: "translate(-2px, 1px)" },
          "94%": { transform: "translate(2px, -1px)" },
          "96%": { transform: "translate(-1px, -1px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
