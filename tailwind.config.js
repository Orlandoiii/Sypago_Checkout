/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {


      colors: {
        'main-bg': 'var(--main-bg)',
        'main-bg-secundary': 'var(--main-bg-secundary)',


        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'tertiary': 'var(--tertiary)',

        'error': 'var(--error)',
        'success': 'var(--success)',
        'focus': 'var(--focus)',
      },

    },
  },
  plugins: [],
}