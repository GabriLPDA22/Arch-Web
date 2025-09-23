/** @type {import('tailwindcss').Config} */
export default {
  // ESTA LÍNEA ES LA MÁS IMPORTANTE
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Le dice que escanee todo en 'src'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
