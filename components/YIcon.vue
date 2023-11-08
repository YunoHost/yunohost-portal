<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string
    size?: string
  }>(),
  {
    size: '1.5em',
  },
)
</script>

<template>
  <NuxtIcon :name="name" :style="`--size: ${size}`" />
</template>

<style scoped>
.nuxt-icon :deep(svg) {
  /* Do not use `v-bind(size)`, idk why bind is not working */
  width: var(--size);
  height: var(--size);
  display: inline;
}
</style>
