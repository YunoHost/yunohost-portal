<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string
    text?: string
    srOnly?: boolean
  }>(),
  {
    tag: 'h1',
    text: undefined,
    srOnly: false,
  },
)
</script>

<template>
  <component
    :tag="tag"
    id="main-target"
    tabindex="-1"
    class="inline-block text-4xl font-bold"
    :class="{ 'sr-only focus:not-sr-only': srOnly }"
  >
    <slot name="default">
      {{ text }}
    </slot>
  </component>
</template>

<style scoped>
#main-target {
  /* Need some override here because of `not-sr-only` styles */
  margin-top: 2rem !important;
  margin-bottom: 0.75rem !important;
}
</style>
