/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grey-bg': '#0A0A0C',
        'grey-nav': '#101013',
        'grey-box': '#191A1E',
        'grey-boxRoutine': '#2C2E33',
        'grey-boxActivity': '#51545E',
        'grey-loginGoogle': '#53565E',
        'grey-loginGoogleHover': '#4A4D54',
        'grey-login': '#131417',
        'white-borderbox': 'D9D9D9',
        'white-text': '#FFFFFF',
        'red':'#B4171A',
        'redHover':'#6B1011'
      },

      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },

      screens: {
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1060px',
      },
    },
  },
  plugins: [],
}
