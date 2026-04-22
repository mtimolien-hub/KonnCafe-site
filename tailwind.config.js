/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 60/20/15/5 brand palette — strict adherence required
        "konncafe-black":   "#1A1A1A", // Primary Background (60%) — Charcoal Black
        "konncafe-sand":    "#E8D8C4", // Secondary / Warmth (20%) — Warm Sand
        "konncafe-smoke":   "#F5F5F5", // Text / Contrast (15%) — White Smoke
        "konncafe-gold":    "#C8A97E", // Accent Only (5%) — Soft Gold (NEVER as background)

        // Semantic aliases for developer clarity
        background:  "#1A1A1A",
        warmth:      "#E8D8C4",
        foreground:  "#F5F5F5",
        accent:      "#C8A97E",

        // Extended tonal ramps derived from brand primaries
        "black-900":  "#111111",
        "black-800":  "#1A1A1A",
        "black-700":  "#242424",
        "black-600":  "#2E2E2E",
        "black-500":  "#3A3A3A",
        "sand-100":   "#FAF5EF",
        "sand-200":   "#F2E8D8",
        "sand-300":   "#E8D8C4",
        "sand-400":   "#D9C4A8",
        "gold-light": "#DFC49A",
        "gold-base":  "#C8A97E",
        "gold-dark":  "#A88A5E",
      },

      fontFamily: {
        // Headlines: Bebas Neue — always ALL CAPS
        display: ["'Bebas Neue'", "Impact", "sans-serif"],
        // Body: Lato — minimum 14px
        body:    ["'Lato'", "Helvetica Neue", "Arial", "sans-serif"],
        sans:    ["'Lato'", "Helvetica Neue", "Arial", "sans-serif"],
      },

      fontSize: {
        // Body minimum 14px enforced
        "body-sm": ["14px",  { lineHeight: "1.6" }],
        "body-md": ["16px",  { lineHeight: "1.7" }],
        "body-lg": ["18px",  { lineHeight: "1.7" }],
        // Display scale
        "display-sm":  ["48px",  { lineHeight: "1",   letterSpacing: "0.04em" }],
        "display-md":  ["72px",  { lineHeight: "0.95", letterSpacing: "0.04em" }],
        "display-lg":  ["96px",  { lineHeight: "0.9",  letterSpacing: "0.04em" }],
        "display-xl":  ["128px", { lineHeight: "0.88", letterSpacing: "0.04em" }],
        "display-2xl": ["160px", { lineHeight: "0.85", letterSpacing: "0.04em" }],
      },

      letterSpacing: {
        "widest-2": "0.25em",
        "widest-3": "0.35em",
        "display":  "0.04em",
      },

      spacing: {
        "section": "120px",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
        "34":  "8.5rem",
        "88":  "22rem",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
      },

      maxWidth: {
        "8xl":  "88rem",
        "9xl":  "96rem",
        "10xl": "104rem",
      },

      backgroundImage: {
        // Cinematic gradient used as hero overlay
        "hero-vignette": "radial-gradient(ellipse at center, transparent 30%, #1A1A1A 100%)",
        "hero-overlay":  "linear-gradient(to bottom, rgba(26,26,26,0.3) 0%, rgba(26,26,26,0.7) 60%, #1A1A1A 100%)",
        "section-fade":  "linear-gradient(to bottom, #1A1A1A, #242424, #1A1A1A)",
        "gold-shimmer":  "linear-gradient(90deg, #C8A97E 0%, #DFC49A 50%, #C8A97E 100%)",
        "grain":         "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },

      boxShadow: {
        "gold-glow":   "0 0 30px rgba(200, 169, 126, 0.25)",
        "gold-border": "inset 0 0 0 1px rgba(200, 169, 126, 0.4)",
        "deep":        "0 25px 80px rgba(0, 0, 0, 0.8)",
        "card":        "0 4px 32px rgba(0, 0, 0, 0.6)",
        "inner-dark":  "inset 0 2px 16px rgba(0, 0, 0, 0.5)",
      },

      borderColor: {
        gold:      "#C8A97E",
        "gold-dim": "rgba(200, 169, 126, 0.3)",
        "sand-dim": "rgba(232, 216, 196, 0.2)",
        "white-dim": "rgba(245, 245, 245, 0.1)",
      },

      animation: {
        "fade-up":       "fadeUp 0.8s ease-out forwards",
        "fade-in":       "fadeIn 1s ease-out forwards",
        "shimmer":       "shimmer 3s ease-in-out infinite",
        "grain-drift":   "grainDrift 8s steps(10) infinite",
        "pulse-gold":    "pulseGold 2s ease-in-out infinite",
        "line-expand":   "lineExpand 1.2s ease-out forwards",
        "slow-zoom":     "slowZoom 20s ease-in-out infinite alternate",
      },

      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        grainDrift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%":      { transform: "translate(-2%, -2%)" },
          "20%":      { transform: "translate(2%, 2%)" },
          "30%":      { transform: "translate(-1%, 3%)" },
          "40%":      { transform: "translate(3%, -1%)" },
          "50%":      { transform: "translate(-3%, 1%)" },
          "60%":      { transform: "translate(1%, -3%)" },
          "70%":      { transform: "translate(-2%, 2%)" },
          "80%":      { transform: "translate(2%, -2%)" },
          "90%":      { transform: "translate(-1%, -1%)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1",   boxShadow: "0 0 20px rgba(200, 169, 126, 0.3)" },
          "50%":      { opacity: "0.7", boxShadow: "0 0 40px rgba(200, 169, 126, 0.6)" },
        },
        lineExpand: {
          "0%":   { width: "0%",   opacity: "0" },
          "100%": { width: "100%", opacity: "1" },
        },
        slowZoom: {
          "0%":   { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
      },

      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },

      transitionTimingFunction: {
        "in-expo":    "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo":   "cubic-bezier(0.19, 1, 0.22, 1)",
        "in-out-premium": "cubic-bezier(0.645, 0.045, 0.355, 1)",
      },

      aspectRatio: {
        "cinematic": "21 / 9",
        "portrait":  "3 / 4",
        "product":   "4 / 5",
      },
    },
  },
  plugins: [
    // Utility plugin: text-balance, font-display classes
    function ({ addUtilities }) {
      addUtilities({
        ".text-balance": { "text-wrap": "balance" },
        ".text-pretty":  { "text-wrap": "pretty" },
        ".font-display-caps": {
          "font-family":     "'Bebas Neue', Impact, sans-serif",
          "text-transform":  "uppercase",
          "letter-spacing":  "0.04em",
        },
        ".font-body": {
          "font-family": "'Lato', Helvetica Neue, Arial, sans-serif",
          "font-size":   "16px",
          "line-height": "1.7",
        },
        ".gold-rule": {
          "height": "1px",
          "background": "linear-gradient(90deg, transparent, #C8A97E, transparent)",
        },
        ".bg-noise": {
          "position": "relative",
        },
        ".bg-noise::after": {
          "content":    "''",
          "position":   "absolute",
          "inset":      "0",
          "background": "url(\"data:image/svg+xml,...\")",
          "opacity":    "0.04",
          "pointer-events": "none",
        },
      });
    },
  ],
};
