module.exports = {
  // Safelisting some classes to avoid content purge
  plugins: [require('daisyui')],
  safelist: ['safelisted'],
  daisyui: {
    themes: true,
  },
}
