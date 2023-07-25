<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: HTMLButtonElement['type']
    text?: string
    variant?: string
    icon?: string
    block?: boolean
  }>(),
  {
    type: 'button',
    text: undefined,
    variant: 'primary',
    icon: undefined,
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
    <slot name="default">
      <Icon v-if="icon" :name="icon" size="1.5em" aria-hidden="true" />
      {{ text }}
    </slot>
  </button>
</template>
