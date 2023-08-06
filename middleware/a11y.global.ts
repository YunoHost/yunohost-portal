export default defineNuxtRouteMiddleware((to) => {
  if (!to.hash) {
    // Auto select skip link on route change
    nextTick(() => {
      document.getElementById('skip-link')?.focus()
    })
  }
})
