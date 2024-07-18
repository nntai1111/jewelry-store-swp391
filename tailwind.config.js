/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
"./src/**/*.{html,js}",
"./public/index.html"
],
  theme: {
    extend: {
      fontFamily: {
        'dancing': ['"Dancing Script"', 'cursive'],
        'edutas': ['"Edu TAS Beginner"', 'sans-serif'],
        'noto-serif-ethiopic': ['"Noto Serif Ethiopic"', 'serif'],
      },
    },
  },
  plugins: [],
}
