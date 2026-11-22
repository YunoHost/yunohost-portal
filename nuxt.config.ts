import type { LocaleObject } from '@nuxtjs/i18n';
import locales from './i18n/locales.json';
import tailwindcss from '@tailwindcss/vite';

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
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/devtools',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon/module',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@vee-validate/nuxt',
    'nuxt-icons',
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        // For `./ynh-dev use-git yunohost-portal` to work
        allow: ['/var/cache/ynh-dev/yunohost-portal/'],
      },
    },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiIp: '', // overridden by NUXT_PUBLIC_API_IP environment variable
    },
  },
  i18n: {
    strategy: 'no_prefix',
    locales: locales as LocaleObject[],
  },
  colorMode: {
    preference: 'system',
    dataValue: 'theme',
    classSuffix: '',
  },
  compatibilityDate: '2025-07-15',
});
