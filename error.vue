<script setup lang="ts">
import { H3Error } from 'h3'
const { t } = useI18n()

const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
})

defineProps<{
  error: H3Error
}>()
</script>

<template>
  <main
    class="container mx-auto p-10 min-h-screen flex flex-col justify-center items-center"
  >
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir"></Html>
    <CustomLogo class="logo" />
    <div class="text-center mt-10">
      <h1 class="text-2xl font-bold">{{ t('critical_error') }}</h1>
      <p class="py-6">{{ error.statusMessage }}</p>
      <code class="py-6 text-sm">{{ error.data }}</code>
    </div>
  </main>
</template>

<style scoped>
.logo {
  max-width: 196px;
  max-height: 170px;
}
</style>
