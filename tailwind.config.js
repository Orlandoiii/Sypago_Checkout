/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {


      colors: {
        'primary': '#0065BB',
        'secundary': '#00BCF4',
        'tertiary': '#00BCF4',
        'bg-test': 'hsla(207, 82%, 24%, 1)'
      },

    },
  },
  plugins: [],
}