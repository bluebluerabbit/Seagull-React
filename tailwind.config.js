/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    backgroundImage: {
      wave: "url('./img/icon/wave.svg')",
    },
    extend: {
      boxShadow: {
        'nav': '0px -10px 30px 3px rgba(0, 0, 0, 0.15)',
        'nav-sm': '10px -10px 30px 1px rgba(0, 0, 0, 0.1)'
      },
      dropShadow: {
        'position': '0 0px 5px rgba(0, 0, 0, 0.1)',
        'bg': '0 0px 25px rgba(0, 0, 0, 0.15)'
      },
      colors: {
        'main': '#1F83EB'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class',
};