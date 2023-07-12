module.exports = {
  // Safelisting some classes to avoid content purge
  safelist: [
    'safelisted',
    {
      pattern: /bg-.*-500/,
    },
  ]
}
