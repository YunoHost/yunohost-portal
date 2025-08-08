import {
  useIsLoggedIn,
  useRedirectUrl,
  useQueryMsg,
  useSettings,
} from '@/composables/states'

export default defineNuxtRouteMiddleware(async (to) => {
  const isLoggedIn = useIsLoggedIn()
  const settings = await useSettings()

  const redirectUrl = useRedirectUrl()
  if (to.query.rd) {
    redirectUrl.value = to.query.rd as string
    if (to.name !== 'login') {
      return navigateTo({ path: '/login', query: { rd: to.query.rd } })
    }
  } else {
    redirectUrl.value = null
  }

  const queryMsg = useQueryMsg()
  if (to.query.msg) {
    queryMsg.value = to.query.msg as string
  } else {
    queryMsg.value = null
  }

  if (to.name === 'login') {
    if (isLoggedIn.value) {
      return navigateTo('/')
    }
  } else if (!isLoggedIn.value && !(to.meta.public && settings.value.public)) {
    return navigateTo('/login')
  }
})
