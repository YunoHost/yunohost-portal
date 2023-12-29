<script setup lang="ts">
const props = defineProps<{
  loading: boolean | null
  text?: string
  loadingText?: string
  icon?: string
  loadingIcon?: string
}>()

const { t } = useI18n()
const baseAttrs = useAttrs()
const attrs = computed(() => {
  return {
    text: props.loading
      ? props.loadingText || t('saving')
      : props.text || t('save'),
    icon:
      props.loading === true
        ? props.loadingIcon || 'loading'
        : props.loading === false
          ? 'thumb-up'
          : props.icon,
    iconClass: props.loading ? 'animate-spin' : '',
    ...baseAttrs,
  }
})

const onClick = (e: MouseEvent) => {
  if (props.loading) {
    e.preventDefault()
  }
}
</script>

<template>
  <YButton v-bind="attrs" type="submit" @click="onClick" />
</template>
