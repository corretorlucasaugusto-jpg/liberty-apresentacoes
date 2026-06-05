/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        liberty: { blue: '#1266CD', dark: '#1d1d1f', gray: '#6e6e73', light: '#f5f5f7' }
      }
    }
  },
  plugins: []
}