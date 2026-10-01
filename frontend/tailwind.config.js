/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F7F4EE',
          200: '#EFEAE1',
          300: '#E4DCD0',
          400: '#D5C9B8',
        },
        coffee: {
          100: '#EADBC8',
          300: '#BC9F8B',
          500: '#7B4B32',
          700: '#4A2818',
          800: '#341B0E',
          900: '#221008',
        },
        burgundy: {
          50: '#FDF2F4',
          100: '#FBE4E7',
          500: '#9B2C3B',
          600: '#7E1F2D',
          700: '#641622',
          800: '#4D0E18',
        },
        charcoal: {
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#0B0F17',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E5EDE5',
          600: '#5F7A61',
          700: '#485F4A',
        },
        cafeYellow: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 10px 30px -10px rgba(61, 38, 26, 0.08)',
        'warm-lg': '0 20px 40px -15px rgba(61, 38, 26, 0.12)',
        'warm-xl': '0 25px 50px -12px rgba(61, 38, 26, 0.18)',
      }
    },
  },
  plugins: [],
}
