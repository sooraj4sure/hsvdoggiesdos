/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // One complimentary palette, defined once here and in globals.css.
        // LIGHT and premium: warm ivory/cream backgrounds, sunny
        // golden-yellow accent (their bright-yellow flyer), rich warm
        // browns for text and small accents, soft peachy warmth.
        // Bright and airy — dark colours only for text, never for
        // background sections. No teal, no blue, no gradients, no neon.
        amber: {
          50: "#fdf9ec",
          100: "#f7ead0",
          200: "#f3ddb0",
          300: "#eec27f",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        },
        teal: {
          50: "#fefce8",
          100: "#fef9c3",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        accent: { 500: "#ca8a04", 600: "#a16207" },
        cream: "#fff8ec",
        mint: "#fdf0dc",
        ink: { 900: "#1c1410", 700: "#44403c", 500: "#78716c" },
        surface: "#fff8ec",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.05), 0 6px 20px rgba(15,23,42,0.05)",
        lift: "0 2px 4px rgba(15,23,42,0.06), 0 16px 32px rgba(15,23,42,0.10)",
        soft: "0 8px 30px rgba(146,64,14,0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 240ms ease-out both",
        "slide-up": "slideUp 260ms ease-out both",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
