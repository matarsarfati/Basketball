/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'israel-blue': '#0038b8',
        'israel-blue-dark': '#002d93',
        'israel-blue-light': '#0046e5',
      },
    },
  },
  plugins: [],
}