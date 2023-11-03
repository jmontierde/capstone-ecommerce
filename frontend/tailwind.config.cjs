/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
      spacing: {
        7: "1.75rem", // Add custom spacing
      },
      fontFamily: {
        custom: ["Oswald", "sans-serif"],
        helvetica: ["Helvetica", "sans-serif"],
      },
      animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
    },
    breadcrumbs: {
      defaultProps: {
        className: "",
        fullWidth: false,
        separator: "/",
      },
      styles: {
        base: {
          root: {
            initial: {
              width: "w-max",
            },
            fullWidth: { display: "block", width: "w-full" },
          },
          list: {
            display: "flex",
            flexWrap: "flex-wrap",
            alignItems: "items-center",
            width: "w-full",
            bg: "bg-blue-gray-50",
            bgOpacity: "bg-opacity-60",
            py: "py-2",
            px: "px-4",
            borderRadius: "rounded-md",
          },
          item: {
            initial: {
              display: "flex",
              alignItems: "items-center",
              color: "#e6e355",
              fontSmoothing: "antialiased",
              fontFamily: "font-sans",
              fontSize: "text-sm",
              fontWeight: "font-normal",
              lineHeight: "leading-normal",
              cursor: "cursor-pointer",
              transition: "transition-colors duration-300",
              hover: "hover:text-[#e6e355]",
            },
            disabled: {
              pointerEvents: "pointer-events-none",
            },
          },
          separator: {
            color: "#e6e355",
            fontSize: "text-sm",
            fontSmoothing: "antialiased",
            fontFamily: "font-sans",
            fontWeight: "font-normal",
            lineHeight: "leading-normal",
            px: "mx-2",
            pointerEvents: "pointer-events-none",
            userSelcet: "select-none",
          },
        },
      },
    },
  },
  plugins: [],
});
