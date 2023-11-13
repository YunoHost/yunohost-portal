// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  spaLoadingTemplate: 'spa-loading-template.html',
  app: {
    baseURL: '/yunohost/sso',
    buildAssetsDir: '/assets/',
  },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'nuxt-icons',
    '@nuxtjs/google-fonts',
  ],
  vite: {
    server: {
      fs: {
        // For `./ynh-dev use-git yunohost-portal` to work
        allow: ["/var/cache/ynh-dev/yunohost-portal/"]
      }
    }
  },
  devtools: { enabled: true },
  googleFonts: {
    families: {
      'Source+Sans+3': [500, 900],
    },
  },
  runtimeConfig: {
    public: {
      apiIp: '', // overridden by NUXT_PUBLIC_API_IP environment variable
    },
  },
  i18n: {
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        iso: 'en',
        name: 'English (United States)',
        file: 'en.json',
      },
    ],
  },
  colorMode: {
    preference: 'system',
    dataValue: 'theme',
    classSuffix: '',
  },
})
