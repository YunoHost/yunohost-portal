import { useIsLoggedIn, useRedirectUrl } from '@/composables/states'

export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = useIsLoggedIn()

  useRedirectUrl().value = (from.query.r as string) || null
  if (useRedirectUrl().value && to.name === 'login') {
    to.query.r = useRedirectUrl().value
  }

  if (to.name === 'login' && isLoggedIn.value) {
    return navigateTo('/')
  }
  if (to.name !== 'login' && !isLoggedIn.value) {
    return navigateTo('/login')
  }
})
