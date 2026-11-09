<script setup lang="ts">
const props = defineProps<{
  codes: string[]
}>()

const { t } = useI18n()
const copied = ref(false)

const asText = computed(() => props.codes.join('\n') + '\n')

async function copy() {
  try {
    await navigator.clipboard.writeText(asText.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Clipboard API unavailable (eg. non-secure context): codes stay visible
  }
}

function download() {
  const blob = new Blob(
    [
      t('twofactor.recovery_codes_file_header', { host: location.host }),
      '\n\n',
      asText.value,
    ],
    { type: 'text/plain' },
  )
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recovery-codes-${location.host}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <BaseAlert
      variant="warning"
      icon="alert-outline"
      :message="t('twofactor.recovery_codes_explain')"
      class="mb-4"
    />

    <ul
      class="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-lg bg-base-200 rounded-box p-4 mb-3"
      :aria-label="t('twofactor.recovery_codes')"
    >
      <li v-for="code in codes" :key="code">{{ code }}</li>
    </ul>

    <div class="flex flex-wrap gap-2">
      <YButton
        :text="copied ? t('twofactor.copied') : t('twofactor.copy')"
        icon="content-copy"
        variant="info"
        class="btn-sm"
        @click="copy"
      />
      <YButton
        :text="t('twofactor.download')"
        icon="download"
        variant="info"
        class="btn-sm"
        @click="download"
      />
    </div>
  </div>
</template>
