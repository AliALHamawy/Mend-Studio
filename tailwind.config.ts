import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)"
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)"
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)"
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)"
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)"
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)"
        },
        ink: "var(--foreground)",
        paper: "var(--background)",
        line: "var(--border)",
        signal: "var(--signal)",
        panel: "var(--card)"
      },
      keyframes: {
        "page-enter": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "swap-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(-3px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "menu-in": {
          from: { opacity: "0", transform: "translateY(-12px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" }
        },
        progress: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" }
        }
      },
      animation: {
        "page-enter": "page-enter 0.45s ease-out both",
        "swap-in": "swap-in 0.3s ease-out both",
        "fade-in": "fade-in 0.2s ease-out both",
        "pop-in": "pop-in 0.25s ease-out both",
        "menu-in": "menu-in 0.2s ease-out both",
        float: "float 2.4s ease-in-out infinite",
        progress: "progress 1.2s ease-out"
      }
    }
  },
  plugins: []
};

export default config;
