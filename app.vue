<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
})
</script>

<template>
  <NuxtLayout>
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir" />

    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body {
  font-family: 'Source Sans 3';
}

#__nuxt {
  @apply min-h-screen flex;
}
</style>
