<script setup lang="ts">
definePageMeta({
  layout: false,
  public: true,
})

const isLoggedIn = useIsLoggedIn()

onMounted(async () => {
  await useApi('/logout', { method: 'GET' })
  isLoggedIn.value = false
  await navigateTo('/login')
})
</script>

<template>
  <div>Logging out...</div>
</template>
