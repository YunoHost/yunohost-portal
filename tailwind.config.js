module.exports = {
  // Safelisting some classes to avoid content purge
  plugins: [require('daisyui')],
  safelist: [
    'safelisted',
    {
      pattern: /bg-.*-500/,
    },
  ],
  daisyui: {
    themes: true,
  }
}
