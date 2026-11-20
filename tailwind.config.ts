import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Universitat Rovira i Virgili brand colours
      colors: {
        'urv-red': '#90292A',
        'urv-black': '#231F20',
        'comp-red': '#EB0029',
        'comp-dark-red': '#AC162C',
        'comp-yellow': '#FFCE00',
        'comp-light-gray': '#DBD9D6',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
} satisfies Config;
