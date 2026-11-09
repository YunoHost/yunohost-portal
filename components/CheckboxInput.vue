<script setup lang="ts">
import { useField } from 'vee-validate'
import { formGroupExtras } from '@/composables/form'

const props = defineProps<{
  name: string
}>()

const { describedBy, invalid } = inject(formGroupExtras, {
  describedBy: ref(undefined),
  invalid: ref(false),
})

// Plain boolean field: simpler and more predictable than vee-validate's
// checkbox mode, which toggles the value instead of setting it
const { value, handleBlur } = useField<boolean>(() => props.name)
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
  <input
    :id="name"
    :name="name"
    type="checkbox"
    :checked="!!value"
    :aria-invalid="invalid"
    :aria-describedby="describedBy"
    class="checkbox"
    :class="{ 'checkbox-error': invalid }"
    @change="value = ($event.target as HTMLInputElement).checked"
    @blur="handleBlur"
  />
</template>
