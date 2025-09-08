import colors from "tailwindcss/colors";
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.75rem",
    },
    extend: {
      screens: {
        "2xl": "1400px",
        1050: "1050px",
        800: "800px",
        900: "900px",
        500: "500px",
      },
      transitionTimingFunction: {
        style: "cubic-bezier(0.77, 0, 0.175, 1)",
      },
      backgroundImage: {
        homeBg: "url('/background/homeBg.png')",
        cardBg: "url('/background/cardBg.png')",
        musicBg: "url('/background/musicBg.png')",
        spiralBg: "url('/background/spiral.png')",
      },
      colors: {
        hollywood: {
          50: "#FDB2DF",
          100: "#FD9ED7",
          200: "#FC76C6",
          300: "#FB4EB6",
          400: "#FB26A5",
          500: "#F30593",
          600: "#BC0472",
          700: "#850350",
          800: "#4E022F",
          900: "#17000E",
          950: "#000000",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",

        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },
      },
    },
    darkMode: "class",
    plugins: [nextui()],
  },
};
