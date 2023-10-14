/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "../core/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern:
        /bg-(primary|danger|success|warning)|border-(primary|danger|success|warning)/,
      variants: ["hover", "before", "after"],
    },
    {
      pattern: /text-(primary|danger|success|warning)/,
      variants: ["hover"],
    },
    {
      pattern:
        /from-(primary|danger|success|warning)|to-(primary|danger|success|warning)/,
      variants: ["hover"],
    },
  ],
  theme: {
    extend: {
      spacing: {
        headerHeight: "56px",
        screenMinusHeaderHeight: "calc(100vh - 56px)",
        pageHeadHeight: "85px",
        fullMinusPageHeadHeight: "calc(100% - 85px)",
        content: "1.5rem",
        iconButtonPadding: ".25rem",
        inputXPadding: ".5rem",
        kanbanColumnPadding: ".5rem",
        card: "1.5rem",
        cardMobile: "1.2rem",
        buttonTextPadding: ".5rem",
        selectActivatorPadding: ".5rem",
      },
      padding: {
        repetable: "1.4rem",
        repetableMobile: ".8rem",
        sidebarX: "1.25rem",
        contentX: "1.5rem",
        contentXMobile: "1rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 7%)",
        sidebar: "0 1px 0 1px #edeae9, 0 5px 20px 0 rgba(109, 110, 111, 0.08)",
        nav: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        avatar:
          "0px 0.3px 0.9px rgba(0, 0, 0, 0.25), 0px 1.6px 3.6px rgba(0, 0, 0, 0.28)",
      },
      zIndex: {
        modal: 60,
        nav: 45,
        sidebar: 55,
        header: 50,
        // todo : add z-index menu position 'root'
      },
      backgroundColor: {
        inputDisabled: "f0f0f0",
        header: "#2e2e30",
        actions: "rgb(249 250 251 / var(--tw-bg-opacity))",
        tooltip: "#616161e6",
      },
      borderColor: {
        input: "#d1d5db",
      },
      height: {
        input: "35px",
      },
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#562ff1",
          800: "#3730a3",
          900: "#312e81",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      borderRadius: {
        sm: "0.4rem",
        md: "0.8rem",
        lg: "1rem",
        xl: "1.2rem",
        "2xl": "1.4rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "gradient-245": "linear-gradient(245deg, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: false },
};
