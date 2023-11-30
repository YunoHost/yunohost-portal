import {
  useIsLoggedIn,
  useRedirectUrl,
  useSettings,
} from '@/composables/states'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isLoggedIn = useIsLoggedIn()
  const settings = await useSettings()

  const redirectUrl = useRedirectUrl()
  if (to.query.r) {
    redirectUrl.value = to.query.r as string
    if (to.name !== 'login') {
      return navigateTo({ path: '/login', query: { r: to.query.r } })
    }
  } else {
    redirectUrl.value = null
  }

  if (to.name === 'login') {
    if (isLoggedIn.value) {
      return navigateTo('/')
    }
  } else if (!isLoggedIn.value && !(to.meta.public && settings.value.public)) {
    return navigateTo('/login')
  }
})
