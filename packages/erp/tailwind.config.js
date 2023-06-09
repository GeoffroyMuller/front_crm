/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "../core/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        sm: '0.4rem',
        md: '0.8rem',
        lg: '1rem',
        xl: '1.2rem',
        '2xl': '1.4rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: false, }
}

