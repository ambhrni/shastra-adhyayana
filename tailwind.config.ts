import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        devanagari: ['var(--font-devanagari)', 'Noto Sans Devanagari', 'sans-serif'],
      },
      colors: {
        saffron: {
          50:  '#fff8f0',
          100: '#ffecd6',
          200: '#ffd4a8',
          300: '#ffb570',
          400: '#ff8c38',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
