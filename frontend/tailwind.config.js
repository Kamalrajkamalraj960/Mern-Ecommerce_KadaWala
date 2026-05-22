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
          green: {
            50: '#f2f7f5',
            100: '#e1ede8',
            200: '#c5dcd2',
            300: '#9bbcaf',
            400: '#6c9684',
            500: '#1b4d3e', // Primary deep forest green
            600: '#163f33',
            700: '#113127',
            800: '#0c231c',
            900: '#071511',
          },
          gold: {
            50: '#fbf9eb',
            100: '#f6f0cd',
            200: '#eedf9a',
            300: '#e3c65c',
            400: '#d9ad2d',
            500: '#d4af37', // Primary warm gold
            600: '#af8c25',
            700: '#8a6c19',
            800: '#654c12',
            900: '#402f0a',
          },
          cream: '#FAF9F6', // Off-white warm background
          charcoal: '#121212', // Off-black
          slate: '#242424',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        'gold-glow': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
