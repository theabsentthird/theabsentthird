/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'secondary-1': 'var(--secondary-1)',
        'secondary-2': 'var(--secondary-2)',
        'secondary-3': 'var(--secondary-3)',
        'content-light': 'var(--content-light)',
        'content-dark': 'var(--content-dark)',
      },
    },
  },
  plugins: [],
}