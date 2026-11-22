<script setup lang="ts">
import { NuxtLink } from '#components'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    text?: string
    variant?: string
    icon?: string
    iconSize?: string
    iconOnly?: boolean
    iconClass?: string
    block?: boolean
  }>(),
  {
    type: 'button',
    text: undefined,
    variant: 'primary',
    icon: undefined,
    iconSize: '1.5em',
    iconClass: '',
    iconOnly: false,
    block: false,
  },
)

const variantClass = computed(() => {
  return {
    primary: 'btn-primary',
    success: 'btn-success',
    info: 'btn-info',
    error: 'btn-error',
  }[props.variant]
})
</script>

<template>
  <component
    :is="$attrs.to ? NuxtLink : 'button'"
    class="btn"
    :class="[variantClass, { 'btn-block': block }]"
    :type="$attrs.to ? null : type"
  >
    <slot name="default">
      <YIcon
        v-if="icon"
        :name="icon"
        :size="iconSize"
        :class="iconClass"
        aria-hidden="true"
      />
      <span :class="{ 'sr-only': iconOnly }">{{ text }}</span>
    </slot>
  </component>
</template>
