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
      'grey-nav': '#101113',
      'grey-box': '#191A1E',
      'gray-box2': '#2C2E33',
      'gray-header': '#101013',
      'grey-boxRoutine': '#2C2E33',
      'grey-boxActivity': '#51545E',
      'grey-loginGoogle': '#53565E',
      'grey-loginGoogleHover': '#4A4D54',
      'grey-login': '#131417',
      'white-borderbox': 'D9D9D9',
      'white-text': '#FFFFFF',
      'red': '#B4171A',
      'redHover': '#6B1011',
      'accent': 'rgb(var(--acent))',
      'accent-foreground': 'rbg(0 0% 9%)',
      'background': '0 0% 100%',
      'foreground': '0 0% 3.9%',
      'card': '0 0% 100%',
      'card-foreground': '0 0% 3.9%',
      'popover': '0 0% 100%',
      'popover-foreground': '0 0% 3.9%',
      'primary': '0 72.2% 50.6%',
      'primary-foreground': '0 85.7% 97.3%',
      'secondary': '0 0% 96.1%',
      'secondary-foreground': '0 0% 9%',
      'muted': '0 0% 96.1%',
      'muted-foreground': '0 0% 45.1%',
      'destructive': '0 84.2% 60.2%',
      'destructive-foreground': '0 0% 98%',
      'border': '0 0% 89.8%',
      'input': '0 0% 89.8%',
      'ring': '0 72.2% 50.6%',
      'radius': '0.5rem',
      'chart-1': '12 76% 61%',
      'chart-2': '173 58% 39%',
      'chart-3': '197 37% 24%',
      'chart-4': '43 74% 66%',
      'chart-5': '27 87% 67%',
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