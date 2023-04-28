const { theme } = require("tailwindcss/defaultConfig")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Mona Sans", ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
