import { setLocale } from 'yup'
import { usePreferedLocale } from '@/composables/states'

export default defineNuxtPlugin({
  setup() {
    // Override default yup errors
    // https://github.com/jquense/yup/blob/master/src/locale.ts
    setLocale({
      mixed: {
        default: 'v.field_invalid',
        required: 'v.field_required',
      },
      string: {
        email: 'v.email',
        min: ({ min }) => ({ key: 'v.string_too_short', values: { min } }),
      },
    })
  },
  hooks: {
    'app:created'() {
      // Override browser locale if prefered language
      const preferedLocale = usePreferedLocale()
      if (preferedLocale.value !== 'auto') {
        useNuxtApp().$i18n.locale.value = preferedLocale.value
      }
    },
  },
})
