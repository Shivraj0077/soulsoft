/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}', // Include Next.js app directory
      './pages/**/*.{js,ts,jsx,tsx,mdx}', // Include pages directory
      './components/**/*.{js,ts,jsx,tsx,mdx}', // Include components directory
      './src/**/*.{js,ts,jsx,tsx,mdx}', // Include src directory if used
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };