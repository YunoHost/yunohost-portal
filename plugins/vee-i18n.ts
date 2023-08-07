import { setLocale } from 'yup'

export default defineNuxtPlugin(() => {
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
})
