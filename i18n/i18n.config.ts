import type { FallbackLocale } from 'vue-i18n';
import locales from './locales.json';

// https://vue-i18n.intlify.dev/guide/essentials/fallback#explicit-fallback-with-decision-maps
const fallbackLocale = Object.fromEntries(
  locales
    .filter((locale) => locale.fallback)
    .map((locale) => [locale.code, locale.fallback]),
) as Record<string, string[]>;
fallbackLocale.default = ['en'];

export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: fallbackLocale as FallbackLocale,
}));
