module.exports = {
  content: [
    "./public/**/*.html",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        "konncafe-black": "#1A1A1A",
        "konncafe-sand":  "#E8D8C4",
        "konncafe-smoke": "#F5F5F5",
        "konncafe-gold":  "#C8A97E"
      },
      fontFamily: {
        display: ["'Bebas Neue'", "Impact", "sans-serif"],
        body: ["'Lato'", "Helvetica Neue", "Arial", "sans-serif"]
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translate3d(0,20px,0)" },
          "100%": { opacity: "1", transform: "translate3d(0,0,0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        kcMq: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" }
        },
        heroLoop: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-3%,0,0) scale(1.01)" },
          "100%": { transform: "translate3d(0,0,0) scale(1)" }
        }
      },
      animation: {
        "fade-up": "fadeUp 1s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        "marquee": "kcMq 25s linear infinite",
        "hero-loop": "heroLoop 18s linear infinite"
      }
    }
  },
  plugins: []
};