/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
        "spin-slow": "spin 20s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)",
            opacity: "0.6",
          },
          "50%": {
            transform: "translateY(-20px)",
            opacity: "0.2",
          },
        },
      },
      backdropBlur: {
        sm: "4px", // Ensure backdrop-blur-sm is supported
      },
    },
  },
  plugins: [],
};
