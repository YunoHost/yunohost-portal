<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import type { Feedback } from '@/composables/form'
import type { TwoFactorSetup, TwoFactorStatus } from '@/utils/twofactor'

const { t } = useI18n()

// 'idle': show status and actions
// 'setup': QR code + recovery codes + confirmation code
// 'disable' / 'regenerate': ask for a code to confirm the action
// 'new_codes': display freshly generated recovery codes
type Mode = 'idle' | 'setup' | 'disable' | 'regenerate' | 'new_codes'

const status = ref<TwoFactorStatus | null>(null)
const unavailable = ref(false)
const mode = ref<Mode>('idle')
const setup = ref<TwoFactorSetup | null>(null)
const newCodes = ref<string[]>([])
const loading = ref(false)
const feedback = ref<Feedback>(null)

const { handleSubmit, resetForm, setFieldError } = useForm({
  validationSchema: computed(() =>
    toTypedSchema(
      yup.object({
        code: yup.string().trim().required(),
        saved_codes:
          mode.value === 'setup'
            ? yup
                .boolean()
                .oneOf([true], 'twofactor.must_save_recovery_codes')
                .required('twofactor.must_save_recovery_codes')
            : yup.boolean(),
      }),
    ),
  ),
  initialValues: { code: '', saved_codes: false },
})

async function fetchStatus() {
  try {
    const { data, error } = await useApi<TwoFactorStatus>('/me/twofactor')
    if (error.value) {
      unavailable.value = true
    } else {
      status.value = data.value
    }
  } catch {
    // Older API without 2FA support: just hide the section
    unavailable.value = true
  }
}
await fetchStatus()

function setMode(next: Mode) {
  mode.value = next
  resetForm({ values: { code: '', saved_codes: false } })
}

function errorMessage(err: { data?: any }) {
  return err.data?.error || err.data || t('twofactor.unknown_error')
}

async function startSetup() {
  feedback.value = null
  loading.value = true
  const { data, error } = await useApi<TwoFactorSetup>('/me/twofactor/setup', {
    method: 'POST',
  })
  loading.value = false
  if (error.value) {
    feedback.value = {
      variant: 'error',
      icon: 'alert',
      message: errorMessage(error.value),
    }
    return
  }
  setup.value = data.value
  setMode('setup')
}

function cancel() {
  setup.value = null
  feedback.value = null
  setMode('idle')
}

const onSubmit = handleSubmit(async (form) => {
  loading.value = true
  feedback.value = null
  const code = form.code.trim()

  let result
  if (mode.value === 'setup') {
    result = await useApi('/me/twofactor', {
      method: 'PUT',
      body: { setup_token: setup.value!.setup_token, code },
    })
  } else if (mode.value === 'disable') {
    result = await useApi('/me/twofactor', {
      method: 'DELETE',
      body: { code },
    })
  } else {
    result = await useApi<{ recovery_codes: string[] }>(
      '/me/twofactor/recovery_codes',
      { method: 'POST', body: { code } },
    )
  }
  loading.value = false

  if (result.error.value) {
    const err = result.error.value
    if (err.data?.error_key === 'twofactor_code_invalid') {
      resetForm({ values: { code: '', saved_codes: form.saved_codes } })
      setFieldError('code', 'twofactor.code_invalid')
    } else {
      feedback.value = {
        variant: 'error',
        icon: 'alert',
        message: errorMessage(err),
      }
    }
    return
  }

  const doneMode = mode.value
  await fetchStatus()

  if (doneMode === 'regenerate') {
    newCodes.value = (
      result.data.value as { recovery_codes: string[] }
    ).recovery_codes
    setMode('new_codes')
    return
  }

  setup.value = null
  setMode('idle')
  feedback.value = {
    variant: 'success',
    icon: 'thumb-up',
    message:
      doneMode === 'setup'
        ? t('twofactor.enabled_success')
        : t('twofactor.disabled_success'),
  }
})
</script>

<template>
  <div v-if="!unavailable && status">
    <!-- Status -->
    <div v-if="mode === 'idle'">
      <p class="mb-4">{{ t('twofactor.explain') }}</p>

      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span
          class="badge badge-lg"
          :class="status.enabled ? 'badge-success' : 'badge-ghost'"
        >
          {{
            status.enabled
              ? t('twofactor.status_enabled')
              : t('twofactor.status_disabled')
          }}
        </span>
        <span v-if="status.enforced" class="badge badge-lg badge-info">
          {{ t('twofactor.status_mandatory') }}
        </span>
      </div>

      <template v-if="status.enabled">
        <p
          class="mb-4"
          :class="{ 'text-warning': status.recovery_codes_left <= 3 }"
        >
          {{
            t('twofactor.recovery_codes_left', {
              count: status.recovery_codes_left,
            })
          }}
        </p>
        <p v-if="status.enforced" class="mb-4 text-sm opacity-80">
          {{ t('twofactor.cannot_disable_enforced') }}
        </p>
      </template>

      <BaseAlert
        v-else-if="status.policy === 'disabled'"
        variant="info"
        :message="t('twofactor.disabled_by_admin')"
      />
    </div>

    <!-- Setup -->
    <TwoFactorSetupInfo v-if="mode === 'setup' && setup" :setup="setup" />

    <!-- Fresh recovery codes -->
    <div v-if="mode === 'new_codes'">
      <TwoFactorRecoveryCodes :codes="newCodes" class="mb-4" />
      <YButton :text="t('twofactor.done')" @click="setMode('idle')" />
    </div>

    <p v-if="mode === 'disable'" class="mb-4">
      {{ t('twofactor.confirm_disable') }}
    </p>
    <p v-if="mode === 'regenerate'" class="mb-4">
      {{ t('twofactor.confirm_regenerate') }}
    </p>

    <YForm
      v-if="['setup', 'disable', 'regenerate'].includes(mode)"
      :loading="loading"
      :feedback="feedback"
      @submit.prevent="onSubmit"
    >
      <FormField
        name="code"
        :label="t('twofactor.code_or_recovery_code')"
        :description="
          mode === 'setup'
            ? undefined
            : t('twofactor.code_or_recovery_code_help')
        "
        class="mb-3"
      >
        <TextInput
          name="code"
          type="text"
          :placeholder="t('twofactor.code_placeholder')"
          :inputmode="mode === 'setup' ? 'numeric' : 'text'"
          autocomplete="one-time-code"
          autocapitalize="off"
          spellcheck="false"
          class="w-full font-mono"
        />
      </FormField>

      <FormField
        v-if="mode === 'setup'"
        name="saved_codes"
        :label="t('twofactor.i_saved_recovery_codes')"
        class="mb-3"
      >
        <template #label>
          <span />
        </template>
        <!-- The input is nested in the label (a11y rule can't see through the component) -->
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label class="label cursor-pointer justify-start gap-3">
          <CheckboxInput name="saved_codes" />
          <span>{{ t('twofactor.i_saved_recovery_codes') }}</span>
        </label>
      </FormField>

      <template #actions>
        <div class="ms-auto mt-3 flex gap-2">
          <YButton :text="t('cancel')" variant="" @click="cancel" />
          <YButton
            type="submit"
            :disabled="loading"
            :variant="mode === 'disable' ? 'error' : 'success'"
            :text="
              mode === 'setup'
                ? t('twofactor.enable')
                : mode === 'disable'
                  ? t('twofactor.disable')
                  : t('twofactor.regenerate_codes')
            "
          />
        </div>
      </template>
    </YForm>

    <!-- Idle actions (+ feedback of the last action) -->
    <template v-if="mode === 'idle'">
      <BaseAlert v-if="feedback" v-bind="feedback" class="my-4" />
      <div class="flex flex-wrap gap-2 mt-3">
        <YButton
          v-if="!status.enabled && status.policy !== 'disabled'"
          :text="t('twofactor.enable')"
          icon="shield-lock"
          variant="success"
          :disabled="loading"
          @click="startSetup"
        />
        <template v-if="status.enabled">
          <YButton
            :text="t('twofactor.regenerate_codes')"
            variant="info"
            @click="setMode('regenerate')"
          />
          <YButton
            v-if="!status.enforced"
            :text="t('twofactor.disable')"
            variant="error"
            @click="setMode('disable')"
          />
        </template>
      </div>
    </template>
  </div>
</template>
