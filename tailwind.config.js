/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2937",
        paper: "#FFFDFB",
        panel: "#FFFFFF",
        line: "#F0E7FE",
        pine: {
          50: "#F5F3FF",
          100: "#EDE4FE",
          400: "#A855F7",
          600: "#8B32EA",
          800: "#7C3AED",
          900: "#5B21B6",
        },
        gold: {
          100: "#FEF3C7",
          400: "#FBBF24",
          600: "#F59E0B",
        },
        pink: {
          400: "#F472B6",
          600: "#EC4899",
        },
        cell: "#A855F7",
        event: "#F59E0B",
        worship: "#7C3AED",
        birthday: "#EC4899",
        website: "#FBBF24",
        major: "#8B32EA",
      },
      fontFamily: {
        display: ["'Poppins'", "'Kanit'", "sans-serif"],
        sans: ["'Kanit'", "'Poppins'", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-10px) translateX(8px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "floatSlow 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

