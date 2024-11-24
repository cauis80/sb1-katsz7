/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4400',
          50: '#FFF2ED',
          100: '#FFE5DB',
          200: '#FFCCB8',
          300: '#FFB294',
          400: '#FF9971',
          500: '#FF7F4D',
          600: '#FF4400',
          700: '#CC3600',
          800: '#992900',
          900: '#661B00',
        },
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}