import {
  useIsLoggedIn,
  useRedirectUrl,
  useSettings,
} from '@/composables/states'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isLoggedIn = useIsLoggedIn()
  const settings = await useSettings()

  useRedirectUrl().value = (from.query.r as string) || null
  if (useRedirectUrl().value && to.name === 'login') {
    to.query.r = useRedirectUrl().value
  }

  if (to.name === 'login' && isLoggedIn.value) {
    return navigateTo('/')
  }
  if (!isLoggedIn.value && !(to.meta.public && settings.value.public)) {
    return navigateTo('/login')
  }
})
