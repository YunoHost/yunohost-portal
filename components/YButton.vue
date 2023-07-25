<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: string
    type?: HTMLButtonElement['type']
    block?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    block: false,
  },
)

const variantClass = computed(() => {
  return {
    primary: 'btn-primary',
    success: 'btn-success',
    info: 'btn-info',
  }[props.variant]
})
</script>

<template>
  <button class="btn" :class="[variantClass, { 'btn-block': block }]">
    <slot name="default" />
  </button>
</template>
