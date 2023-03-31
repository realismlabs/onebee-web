const radixColors = require("@radix-ui/colors");

module.exports = {
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("windy-radix-palette")({
    colors: {
      slate: radixColors.slateDark,
      purple: radixColors.purpleDark,
    },
  }),],
}