

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "../core/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'before:bg-primary-500',
    'before:bg-danger-500',
    'before:bg-success-500',
    'before:bg-warning-500',
  
    'hover:bg-primary-500',
    'hover:bg-danger-500',
    'hover:bg-success-500',
    'hover:bg-warning-500',

    'before:border-primary-500',
    'before:border-danger-500',
    'before:border-success-500',
    'before:border-warning-500',
  
    'hover:border-primary-500',
    'hover:border-danger-500',
    'hover:border-success-500',
    'hover:border-warning-500',


    'hover:text-primary-500',
    'hover:text-danger-500',
    'hover:text-success-500',
    'hover:text-warning-500',
    {
      pattern:
        /bg-(primary|danger|success|warning)|text-(primary|danger|success|warning)|border-(primary|danger|success|warning)/,
    }
  ],
  theme: {
    extend: {
      colors: {
        primary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#562ff1',
            800: '#3730a3',
            900: '#312e81',
        },
        danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
        success: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
          },
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
        },
      },
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

