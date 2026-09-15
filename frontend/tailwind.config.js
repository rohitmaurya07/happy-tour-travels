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
          yellow: "#FFC72C",       // Primary Requested Yellow (#FFC72C)
          yellowHover: "#E5B020",  // Slightly darker yellow for hover
          yellowLight: "#FFF0C2",  // Soft yellow tint
          gold: "#D97706",
          dark: "#111827",         // Primary dark text / header
          charcoal: "#1E293B",     // Charcoal background
          slate: "#334155",
          lightBg: "#F8FAFC",
        }
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        nexa: ['"Nexa Rust"', 'Outfit', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        'floating': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'yellow-glow': '0 10px 25px -5px rgba(255, 199, 44, 0.45)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
