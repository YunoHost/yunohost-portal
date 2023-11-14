<script setup lang="ts">
import { useField } from 'vee-validate'
import { formGroupExtras } from '@/composables/form'

const props = withDefaults(
  defineProps<{
    name: string
    type: HTMLInputElement['type']
  }>(),
  {},
)
const attrs = useAttrs()
const { describedBy, invalid } = inject(formGroupExtras, {
  describedBy: ref(undefined),
  invalid: ref(false),
})
const { value, handleBlur, handleChange, errorMessage } = useField(
  () => props.name,
  {
    validateOnValueUpdate: false,
  },
)

const validationListeners = {
  blur: (e: FocusEvent) => handleBlur(e, true),
  change: handleChange,
  input: (e: InputEvent) => handleChange(e, !!errorMessage.value),
}
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
  <input
    :id="name"
    :value="value"
    :name="name"
    :type="type"
    :aria-invalid="invalid"
    :aria-describedby="describedBy"
    class="input input-bordered"
    :class="{ 'input-error': invalid }"
    v-bind="attrs"
    v-on="validationListeners"
  />
</template>
