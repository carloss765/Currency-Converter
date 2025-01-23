/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {'anchoTexArea': '300px',},
      height: {'altoTexArea': '10px',},
      height: {'altoDiv': '250px',},
      
    },
  },
  plugins: [],
}

