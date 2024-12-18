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
      'accent': 'hsl(var(--accent))',
      'accent-foreground': 'hsl(var(--accent-foreground))',
      'background': 'hsl(var(--background))',
      'foreground': 'hsl(var(--foreground))',
      'card': 'hsl(var(--card))',
      'card-foreground': 'hsl(var(--card-foreground))',
      'popover': 'hsl(var(--popover))',
      'popover-foreground': 'hsl(var(--popover-foreground))',
      'primary': 'hsl(var(--primary))',
      'primary-foreground': 'hsl(var(--primary-foreground))',
      'secondary': 'hsl(var(--secondary))',
      'secondary-foreground': 'hsl(var(--secondary-foreground))',
      'muted': 'hsl(var(--muted))',
      'muted-foreground': 'hsl(var(--muted-foreground))',
      'destructive': 'hsl(var(--destructive))',
      'destructive-foreground': 'hsl(var(--destructive-foreground))',
      'border': 'hsl(var(--border))',
      'input': 'hsl(var(--input))',
      'ring': 'hsl(var(--ring))',
      'chart-1': 'hsl(var(--chart-1))',
      'chart-2': 'hsl(var(--chart-2))',
      'chart-3': 'hsl(var(--chart-3))',
      'chart-4': 'hsl(var(--chart-4))',
      'chart-5': 'hsl(var(--chart-5))',
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
    borderRadius: {
      'rounded': 'var(--radius)'
    }
  },
};
// eslint-disable-next-line no-undef
export const plugins = [require("tailwindcss-animate")];