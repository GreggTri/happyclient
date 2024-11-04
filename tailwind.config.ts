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
  			bobbing: 'bobbing 0.5s ease-in-out infinite',
			pop: 'pop 0.5s ease-in-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
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
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		colors: {
  			BLACK: '#111111',
  			WHITE: '#f5f5f5',
  			primary: '#f4e300',
  			background: '#111111',
  			text: '#f5f5f5'
  		}
  	}
  },
  plugins: [require('tailwind-scrollbar'), require("tailwindcss-animate")],
};
export default config;
