<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  name: string
  autocomplete?: string
}>()

const { t, te } = useI18n()
const passwordVisible = ref(false)

const inputType = computed(() => (passwordVisible.value ? 'text' : 'password'))
const toggleLabel = computed(() => {
  const key = passwordVisible.value ? 'hide_password' : 'show_password'

  if (te(key)) {
    return t(key)
  }

  // Keep the control accessible while translations are being completed.
  return passwordVisible.value ? 'Hide password' : 'Show password'
})
</script>

<template>
  <div class="relative w-full">
    <TextInput
      :name="props.name"
      :type="inputType"
      :autocomplete="props.autocomplete"
      class="w-full pr-11"
      v-bind="$attrs"
    />

    <button
      type="button"
      class="btn btn-ghost btn-sm btn-square absolute right-1 top-1/2 -translate-y-1/2"
      :aria-label="toggleLabel"
      :aria-controls="props.name"
      :title="toggleLabel"
      @click="passwordVisible = !passwordVisible"
    >
      <YIcon
        :name="passwordVisible ? 'eye-off-outline' : 'eye-outline'"
        size="1.25em"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
