import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          DEFAULT: '#B1883D',
          foreground: '#fffff',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'buffet-accent': {
          DEFAULT: '#EA8121',
          foreground: '#8F4A0B',
        },
        dg: {
          'buffet-top': '#EA8121',
          'buffet-bottom': '#8F4A0B',
          'payment-top': '#4CAF50',
          'payment-bottom': '#2D631A',
          'enquiry-top': '#11B4E8',
          'enquiry-bottom': '#075F90',
        },
        'error': '#DC143c',
        'mcNiff-offWhite': '#747474',
        'mcNiff-offWhite-2': '#BEBEBE',
        'mcNiff-offWhite-3': '#7B809A',
        'mcNiff-brown': '#194471',
        'mcNiff-green': '#197146',
        'mcNiff-gray-1': '#A6A6A6',
        'mcNiff-gray-2': '#333333',
        'mcNiff-gray-3': '#666666',        
        'mcNiff-light-gray': '#F4F4F4',
        'mcNiff-light-gray1': '#F4F4F4',
        'mcNiff-light-gray-2': '#E4E4E4',
        'mcNiff-light-gray-3': '#AAAAAA',
        'mcNiff-light-gray-4': '#CDC6B9',
        'mcNiff-gray-4': '#DDDBDBCC',
        'mcNiff-dark-grey': '#181818',
        'mcNiff-dark': '#2B2B2B',
        'mcNiff-dark-grey2': '#685634CC',
        '': '#EEE0CB',
        'mcNiff-secondary-light': 'rgba(255, 232, 200, 0.5)',
        'mcNiff-red': '#920505',
        'mcNiff-red-2': '#EC3900',
        'mcNiff-light-red': '#FEF3F2',
        'mcNiff-primary-light': '#E7DCC8',
        'mcNiff-primary': '#B1883D',
        'mcNiff-primary-dark': '#920505',
        'mcNiff-primary-dark-2': '#740000',
        'mcNiff-primary-dark-3': '#560000',
        'mcNiff-primary-red': '#B40707',
        'mcNiff-primary-green': '#D1FADF',
        'mcNiff-primary-grey': '#C1C1C1',
        'mcNiff-primary-grey2': '#EEE0CB',
        'mcNiff-primary-grey3': '#999999',
        'mcNiff-primary-green3': '#288806',
        'mcNiff-light-primary': '#DA8302',
        'mcNiff-primary-dark-4': '#000000', 
        'mcNiff-green-2': '#4CAF50', 
        'mcNiff-red-02': '#F44334',
        'mcNiff-secondary-grey': '#7B809A',
        'mcNiff-off-white': '#EFEFEF'


      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        dashboardCard: '0px 6px 11px 0px #0000000A',
        primaryShadow: '4px 9px 20px 2px #B1833D52',
      },
      keyframes: {
        'loader-rotation': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
