<script setup lang="ts">
import { renderSVG } from 'uqr'
import type { TwoFactorSetup } from '@/utils/twofactor'
import { formatSecret } from '@/utils/twofactor'

const props = defineProps<{
  setup: TwoFactorSetup
}>()

const { t } = useI18n()

// Generated locally from the otpauth:// URI: the secret never leaves the page
const qrSvg = computed(() => renderSVG(props.setup.uri, { border: 2 }))
</script>

<template>
  <div>
    <h3 class="text-xl font-bold mb-2">1. {{ t('twofactor.step_scan') }}</h3>
    <p class="mb-3">{{ t('twofactor.step_scan_help') }}</p>

    <!-- QR codes need a light background to be readable, whatever the theme -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      class="qr bg-white rounded-box p-2 w-56 h-56 mx-auto mb-3"
      role="img"
      :aria-label="t('twofactor.qr_code_label')"
      v-html="qrSvg"
    />

    <details class="mb-6">
      <summary class="cursor-pointer">{{ t('twofactor.cant_scan') }}</summary>
      <p class="mt-2">{{ t('twofactor.manual_key') }}</p>
      <code
        class="block font-mono text-lg break-all bg-base-200 rounded-box p-3 mt-1"
      >
        {{ formatSecret(setup.secret) }}
      </code>
    </details>

    <h3 class="text-xl font-bold mb-2">
      2. {{ t('twofactor.step_save_codes') }}
    </h3>
    <TwoFactorRecoveryCodes :codes="setup.recovery_codes" class="mb-6" />

    <h3 class="text-xl font-bold mb-2">3. {{ t('twofactor.step_confirm') }}</h3>
  </div>
</template>

<style scoped>
.qr :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
