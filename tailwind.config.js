const radixColors = require("@radix-ui/colors");

module.exports = {
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    require("windy-radix-palette")({
      colors: {
        slate: radixColors.slateDark,
        purple: radixColors.purpleDark,
        red: radixColors.redDark,
        amber: radixColors.amberDark,
        green: radixColors.greenDark,
        purple: radixColors.purpleDark,
        plum: radixColors.plumDark,
        pink: radixColors.pinkDark,
        cyan: radixColors.cyanDark,
      },
    }), require('@tailwindcss/forms'),],
}