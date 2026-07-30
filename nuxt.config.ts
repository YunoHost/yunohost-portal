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
        { rel: 'manifest', href: '/yunohost/sso/site.webmanifest' },
        { rel: 'apple-touch-icon', href: '/yunohost/sso/icons/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'theme-color', content: '#1c1e21' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
      script: [
        {
          innerHTML: `/* Should we get a random Archillect image for the background? */
const getArchillectBackground = true;

/* Stick your social link in the header, e.g. for https://streetpass.social/
 * set to false to disable. */
const socialurl = 'https://social.sdfeu.org/@radian';

const userMail = document.querySelector('.user-mail');
const email = userMail !== null ? userMail.innerText : '';

if (getArchillectBackground) {
  const latestID = 410187; // TODO fetch from .archillect_latest.json
  const poolSize = 50;     // number of latest images to randomise through
  document.styleSheets[0].insertRule(\`.container{
    background: linear-gradient(
      rgba(12,0,12,.9),
      rgba(12,0,12,.5) ),
      url('https://archillect.mhsattarian.workers.dev/$\{Math.floor(Math.random() * poolSize + (latestID - poolSize) + 1)}/img') !important;
  }\`);
  document.styleSheets[0].insertRule(\`body{
    background: linear-gradient(
      rgba(12,0,12,.9),
      rgba(12,0,12,.5) ) !important;
  }\`);
}

if (socialurl) {
  const mastodon = document.createElement('link');
  mastodon.href = socialurl;
  mastodon.rel = 'me';
  document.head.appendChild(mastodon);
}`,
        },
        {
          innerHTML: `new MutationObserver((_, obs) => {
  const input = document.querySelector('input#search');
  const label = document.querySelector('label[for=search]');
  if (input && label) {
    input.placeholder = 'Search the PLANET!!!';
    label.textContent = 'Search the planet.';
    obs.disconnect();
  }
}).observe(document.body, { childList: true, subtree: true });`,
          tagPosition: 'bodyClose',
        },
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
    manifestFilename: 'site.webmanifest',
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
  nitro: {
    prerender: {
      ignore: ['/manifest.json'],
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
