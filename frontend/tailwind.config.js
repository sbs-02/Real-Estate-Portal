/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#000000',
          900: '#0a0a0a',
          800: '#141414',
          700: '#1f1f1f',
          600: '#2a2a2a',
          500: '#444444',
          muted: '#888888',
          light: '#cccccc',
          white: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Varela Round', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
