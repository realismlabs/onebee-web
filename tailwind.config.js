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
        commandBar: {
          from: { opacity: 0, transform: 'translate(-50%, -25%) scale(0.9)' },
          to: { opacity: 1, transform: 'translate(-50%, -25%) scale(1)' },
        }
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        commandBar: 'commandBar 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      colors: {
        slate: {
          0: 'var(--slate-0)',
          1: 'var(--slate-1)',
          2: 'var(--slate-2)',
          3: 'var(--slate-3)',
          4: 'var(--slate-4)',
          5: 'var(--slate-5)',
          6: 'var(--slate-6)',
          7: 'var(--slate-7)',
          8: 'var(--slate-8)',
          9: 'var(--slate-9)',
          10: 'var(--slate-10)',
          11: 'var(--slate-11)',
          12: 'var(--slate-12)',
        },
      },
    },
  },
  plugins: [
    require("windy-radix-palette")({
      colors: {
        slate: radixColors.slateDark,
        purple: radixColors.purpleDark,
        crimson: radixColors.crimsonDark,
        red: radixColors.redDark,
        orange: radixColors.orangeDark,
        amber: radixColors.amberDark,
        green: radixColors.greenDark,
        cyan: radixColors.cyanDark,
        teal: radixColors.tealDark,
        blue: radixColors.blueDark,
        indigo: radixColors.indigoDark,
        purple: radixColors.purpleDark,
        violet: radixColors.violetDark,
        plum: radixColors.plumDark,
        pink: radixColors.pinkDark,
      },
    }), require('@tailwindcss/forms'),],
}

