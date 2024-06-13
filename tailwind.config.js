/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{html,scss,ts}', './src/index.html', './src/styles.scss'],
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/typography')],
  theme: {
    extend: {
      colors: {
        primary: '#673ab7',
        accent: '#ffd740',
        warn: '#f44336'
      }
    }
  }
};
