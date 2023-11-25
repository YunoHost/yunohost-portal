<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message?: string
    variant?: 'info' | 'success' | 'warning' | 'error'
    icon?: string
    assertive?: boolean
  }>(),
  {
    message: '',
    variant: 'info',
    icon: undefined,
    assertive: false,
  },
)

const classVariant = computed(() => {
  return {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  }[props.variant]
})
</script>

<template>
  <div
    :aria-live="assertive ? 'assertive' : 'polite'"
    aria-atomic="true"
    :class="'mt-8 alert ' + classVariant"
  >
    <YIcon v-if="icon" :name="icon" size="2em" aria-hidden="true" />
    <slot name="default">
      {{ message }}
    </slot>
  </div>
</template>
