/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#121212',
        surfaceLight: '#1e1e1e',
        primary: '#6366f1', // Indigo 500
        primaryHover: '#4f46e5', // Indigo 600
        secondary: '#ec4899', // Pink 500
        accent: '#8b5cf6', // Violet 500
        text: '#f3f4f6',
        textMuted: '#9ca3af',
        border: '#27272a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
