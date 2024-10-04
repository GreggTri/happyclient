import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'paper': "url('/assets/paper.svg')",
      },
      animation: {
        bobbing: 'bobbing 0.5s ease-in-out infinite',
      },
      keyframes: {
        bobbing: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      colors: {
        'BLACK': '#111111',
        'WHITE': '#f5f5f5',
        'primary': '#F4E300',
        'background': '#111111',
        'text': '#f5f5f5',
        'secondary': '#a5ad0b'
       },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
export default config;
