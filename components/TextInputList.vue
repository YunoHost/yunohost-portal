<script setup lang="ts">
import { useFieldArray } from 'vee-validate'
import { formGroupExtras } from '@/composables/form'
// FIXME couldn't find a way to get the index of the invalid input so for now
// every inputs are flaged as invalid

const props = defineProps<{
  name: string
  type: HTMLInputElement['type']
  placeholder?: string
}>()

const { describedBy, invalid } = inject(formGroupExtras, {
  describedBy: ref(undefined),
  invalid: ref(false),
})

const { remove, push, fields } = useFieldArray(props.name)
</script>

<template>
  <div v-for="(field, idx) in fields" :key="field.key" class="flex mb-2 join">
    <input
      :id="name + '__' + idx"
      v-model="field.value"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :aria-invalid="invalid"
      :aria-describedby="describedBy"
      class="input input-bordered join-item w-full"
      :class="{ 'input-error': invalid }"
    />

    <YButton
      variant="error"
      icon="mdi:delete-forever"
      icon-size="2em"
      icon-only
      :text="$t('remove')"
      class="join-item px-3"
      @click="remove(idx)"
    />
  </div>

  <YButton :text="$t('add')" @click="push('')" />
</template>
