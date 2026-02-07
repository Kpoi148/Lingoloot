/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          page: 'var(--bg-page)',
          card: 'var(--bg-card)',
          'card-alpha': 'var(--bg-card-alpha)',
          muted: 'var(--bg-muted)',
        },
        content: {
          DEFAULT: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        edge: {
          DEFAULT: 'var(--border-default)',
          muted: 'var(--border-muted)',
        },
        'shadow-theme': 'var(--shadow-color)',
        'progress-track': 'var(--progress-track)',
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-150%) skewX(-25deg)" },
          "100%": { transform: "translateX(150%) skewX(-25deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s infinite",
      },
    },
  },
  plugins: [],
};
