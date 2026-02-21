/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wikya: {
          blue: '#253b56',
          'blue-dark': '#1a2d43',
          orange: '#ed6d1d',
          'orange-dark': '#d45c0f',
          gray: '#3A3A3A',
          'gray-light': '#E8E8E8',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
