// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    "@nuxtjs/google-fonts",
  ],
  devtools: { enabled: true },
  googleFonts: {
    families: {
      'Source+Sans+3': [500, 900]
    }
  }
})
