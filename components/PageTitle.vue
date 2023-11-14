<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string
    srOnly?: boolean
  }>(),
  {
    text: undefined,
    srOnly: false,
  },
)
</script>

<template>
  <h1
    id="main-target"
    tabindex="-1"
    class="inline-block text-4xl font-bold"
    :class="{ 'sr-only focus:not-sr-only': srOnly }"
  >
    <slot name="default">
      {{ text }}
    </slot>
  </h1>
</template>

<style scoped>
h1 {
  /* Need some override here because of `not-sr-only` styles */
  margin-top: 2rem !important;
  margin-bottom: 0.75rem !important;
}
</style>
