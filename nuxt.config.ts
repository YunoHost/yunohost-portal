import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'
import locales from './maintenance/locales.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  spaLoadingTemplate: 'spa-loading-template.html',
  app: {
    baseURL: '/yunohost/sso',
    buildAssetsDir: '/assets/',
    head: {
      link: [
        { rel: 'stylesheet', href: '/yunohost/sso/customassets/custom.css' },
      ],
    },
  },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'nuxt-icons',
    '@nuxtjs/google-fonts',
    '@vite-pwa/nuxt',
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'YunoHost Portal',
      short_name: 'Portal',
      description: 'YunoHost application portal',
      theme_color: '#1c1e21',
      background_color: '#1c1e21',
      display: 'standalone',
      scope: '/yunohost/sso/',
      start_url: '/yunohost/sso/',
      id: '/yunohost/sso/',
      icons: [
        { src: '/yunohost/sso/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/yunohost/sso/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/yunohost/sso/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: '/yunohost/sso/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      screenshots: [
        { src: '/yunohost/sso/icons/icon-512.png', sizes: '512x512', type: 'image/png', form_factor: 'wide', label: 'App launcher' },
        { src: '/yunohost/sso/icons/icon-512.png', sizes: '512x512', type: 'image/png', form_factor: 'narrow', label: 'App launcher' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
    },
  },
  vite: {
    server: {
      fs: {
        // For `./ynh-dev use-git yunohost-portal` to work
        allow: ['/var/cache/ynh-dev/yunohost-portal/'],
      },
    },
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
    locales: locales as LocaleObject[],
  },
  colorMode: {
    preference: 'system',
    dataValue: 'theme',
    classSuffix: '',
  },
  compatibilityDate: '2024-09-24',
})
