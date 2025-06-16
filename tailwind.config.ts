import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2BA30A",
          dark: "#228008"
        },
        brandblue: {
          DEFAULT: "#2323ff",
          dark: "#1a1ab8"
        },
        secondary: "#10305C",
        accent: "#4DC5C1",
        text: "#111111",
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      fontSize: {
        base: "1.02rem",
      },
    },
  },
  plugins: [],
}
export default config 