/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D1660',
        secondary: {
          1: '#E82CAD',
          2: '#F3C13E',
          3: '#4CD0D4',
        },
        // Define content colors directly
        content: {
          light: '#ffffff',
          dark: '#242424',
        }
      },
    },
  },
  plugins: [],
}