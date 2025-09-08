/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Ensure Tailwind scans your files
    theme: {
      extend: {
        colors: {
          primary: "#0391A5",
          secondary: "#F2F3F7",
          danger: "#DC2626",
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
  