/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          black: '#141414',
          gray: '#2F2F2F'
        }
      },
      fontFamily: {
        'netflix': ['Helvetica Neue', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}