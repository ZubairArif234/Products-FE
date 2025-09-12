/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Ensure Tailwind scans your files
    theme: {
      extend: {
         colors: {
       
        hollywood: {
          50:  "#f3f8fc",
          100: "#e6f0f8",
          200: "#c8e0ef",
          300: "#98c6e1",
          400: "#61a9cf",
          500: "#3d8eba",
          600: "#317faf",
          700: "#255b7f",
          800: "#224e6a",
          900: "#214259",
          950: "#162a3b",
        },
      },
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        borderRadius: {
          'xl': '1.5rem',
        },
      },
    },
    plugins: [],
  };
  