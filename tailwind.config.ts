import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			paper: 'url("/assets/paper.svg")'
  		},
  		animation: {
  			bobbing: 'bobbing 0.5s ease-in-out infinite'
  		},
  		keyframes: {
  			bobbing: {
  				'0%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				},
  				'100%': {
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		colors: {
  			BLACK: '#111111',
  			WHITE: '#f5f5f5',
			primary: '#f4e300',
  			// primary: {
  			// 	DEFAULT: 'hsl(var(--primary))',
  			// 	foreground: 'hsl(var(--primary-foreground))'
  			// },
  			background: '#111111',
  			text: '#f5f5f5',
  			// secondary: {
  			// 	DEFAULT: 'hsl(var(--secondary))',
  			// 	foreground: 'hsl(var(--secondary-foreground))'
  			// },
  			// foreground: 'hsl(var(--foreground))',
  			// card: {
  			// 	DEFAULT: 'hsl(var(--card))',
  			// 	foreground: 'hsl(var(--card-foreground))'
  			// },
  			// popover: {
  			// 	DEFAULT: 'hsl(var(--popover))',
  			// 	foreground: 'hsl(var(--popover-foreground))'
  			// },
  			// muted: {
  			// 	DEFAULT: 'hsl(var(--muted))',
  			// 	foreground: 'hsl(var(--muted-foreground))'
  			// },
  			// accent: {
  			// 	DEFAULT: 'hsl(var(--accent))',
  			// 	foreground: 'hsl(var(--accent-foreground))'
  			// },
  			// destructive: {
  			// 	DEFAULT: 'hsl(var(--destructive))',
  			// 	foreground: 'hsl(var(--destructive-foreground))'
  			// },
  		}
  	}
  },
  plugins: [require('tailwind-scrollbar'), require("tailwindcss-animate")],
};
export default config;
