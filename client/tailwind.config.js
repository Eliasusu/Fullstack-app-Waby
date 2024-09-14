/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"];
export const content = [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
];
export const prefix = "";
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
        colors: {
        'grey-bg': '#0A0A0C',
        'grey-nav': '#101013',
        'grey-box': '#191A1E',
        'gray-box2': '#2C2E33',
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
    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
  },
};
// eslint-disable-next-line no-undef
export const plugins = [require("tailwindcss-animate")];