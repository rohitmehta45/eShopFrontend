/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        primary: {
           50: '#F7F3EE',
          100: '#EFE8DF',
          200: '#E7DED5',
          300: '#C9B8A8',
          400: '#A96F35',
          500: '#C58B4E',
          600: '#5C4033',
          700: '#2F241F',
          800: '#241B17',
          900: '#1A1411',
        },

        accent: {
          DEFAULT: '#C58B4E',
          hover: '#A96F35',
        },
        ivory: '#F7F3EE',
        surface: '#FFFDFC',
        espresso: '#2F241F',
        mocha: '#5C4033',
        success: '#3F7D58',
        danger: '#B84A4A',
        warning: '#C58B4E',

      },

        fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },

      boxShadow: {
         soft: '0 10px 28px rgba(47, 36, 31, 0.06)',
        
      },

      borderRadius: {
        card: '14px',
      },

      animation: {
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-6px)',
          },
        },

        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },

      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],

        display: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },

  plugins: [],
};