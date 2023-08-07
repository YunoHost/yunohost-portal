<script setup lang="ts">
import { useField } from 'vee-validate'
import { formGroupExtras } from '@/composables/form'

const props = defineProps<{
  name: string
  label: string
  icon?: string
  description?: string
  row?: boolean
  srHideLabel?: boolean
}>()

const { errorMessage } = useField(() => props.name)
const invalid = computed(() => !!errorMessage.value)
const describedBy = computed(() => {
  return (
    [
      props.description ? props.name + '__description' : null,
      invalid.value ? props.name + '__feedback_invalid' : null,
    ]
      .filter((x) => x)
      .join(' ') || undefined
  )
})

provide(formGroupExtras, {
  describedBy,
  invalid,
})
</script>

<template>
  <div>
    <div
      role="group"
      :aria-invalid="invalid"
      :class="{ 'is-invalid': invalid, 'flex-col': !row }"
      class="flex"
    >
      <slot name="label">
        <!-- eslint-disable vuejs-accessibility/label-has-for -->
        <label
          :id="name + '__label'"
          :for="name"
          class="block ms-1 mb-2"
          :class="{ 'sr-only': srHideLabel }"
        >
          <Icon
            v-if="icon"
            :name="icon"
            size="2em"
            aria-hidden="true"
            class="m-2"
          />
          <span :class="{ 'sr-only': !!icon }">{{ label }}</span>
        </label>
      </slot>

      <div>
        <slot name="default" />

        <div
          v-show="invalid"
          :id="name + '__feedback_invalid'"
          tabindex="-1"
          aria-live="assertive"
          aria-atomic="true"
          class="text-error mt-1"
        >
          {{ errorMessage }}
        </div>
        <small
          v-if="description"
          :id="name + '__description'"
          tabindex="-1"
          class="block text-gray-400 mt-1"
        >
          {{ description }}
        </small>
      </div>
    </div>
  </div>
</template>
