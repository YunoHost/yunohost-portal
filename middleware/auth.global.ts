import { useIsLoggedIn } from '@/composables/states'

export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = useIsLoggedIn()

  if (to.name === 'login' && isLoggedIn.value) {
    return navigateTo('/')
  }
  if (!isLoggedIn.value) {
    navigateTo('/login')
  }
})
