module.exports = {
  mode: 'jit',
  content: ['./components/**/*.{vue,js}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({
      addComponents,
    }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
        },
      })
    },
  ],
}
