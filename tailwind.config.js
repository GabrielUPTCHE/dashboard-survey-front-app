/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1c74e9',
        'primary-container': '#eff6ff',
        'on-primary-container': '#1e3a8a',
        'secondary-container': '#dbeafe',
        'on-secondary-container': '#1d4ed8',
        surface: '#f6f7f8',
        'on-surface': '#0f172a',
        'on-surface-variant': '#475569',
        'surface-container-highest': '#e2e8f0',
        'surface-container': '#ffffff',
        'surface-dark': '#111821',
        'surface-container-dark': '#1e293b',
        'outline-variant': '#cbd5e1',
      },
      fontFamily: {
        display: ['Public Sans', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
