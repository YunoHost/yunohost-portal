<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()
</script>

<template>
  <h2 id="main-target" tabindex="-1" class="text-4xl font-bold mb-3">
    <slot name="default">
      {{ text }}
    </slot>
  </h2>
</template>
