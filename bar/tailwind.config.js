/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cocktail Theme: Brighter Midnight Navy & Gold
        cocktail: {
          950: '#222c42', // Brighter Midnight Navy (Main BG) - Easier on the eyes
          900: '#2f3b56', // Lighter Navy (Card BG) - Distinct from BG
          800: '#404d6e', // Lighter Borders
          700: '#546387', // Hovers
          accent: '#e2c070', // Luminous Gold
          'accent-hover': '#f0d389', 
          text: '#ffffff', // Pure White for maximum readability
          muted: '#e2e8f0', // Lighter Slate Gray for secondary text
        },
        // Mocktail Theme: Saturated Mediterranean Teal (Kept as requested)
        mocktail: {
          50: '#f0fdfa', // Minty White (Main BG)
          100: '#ccfbf1', // Light Aqua
          card: '#ffffff', // Clean White
          accent: '#0d9488', // Deep Saturated Teal
          'accent-hover': '#115e59', // Darker Teal
          text: '#134e4a', // Deep Teal/Black
          muted: '#64748b', // Slate Gray
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
