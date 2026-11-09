<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import type { TwoFactorSetup } from '@/utils/twofactor'
import { parseTwoFactorChallenge } from '@/utils/twofactor'

definePageMeta({
  layout: false,
  public: true,
})

const { t } = useI18n()

useHead({
  title: t('login'),
})

const isLoggedIn = useIsLoggedIn()
const redirectUrl = useRedirectUrl()
const queryMsg = useQueryMsg()

// 'password': regular login
// 'code': password OK, the user has 2FA enabled and must give a code
// 'setup': password OK, 2FA is mandatory and the user must set it up now
type Step = 'password' | 'code' | 'setup'
const step = ref<Step>('password')
const setup = ref<TwoFactorSetup | null>(null)
const useRecoveryCode = ref(false)
const stepFeedback = ref<string | null>(null)
const loading = ref(false)

const { handleSubmit, setErrors, setFieldError, setFieldValue, values } =
  useForm({
    validationSchema: computed(() =>
      toTypedSchema(
        yup.object({
          username: yup.string().required(),
          password: yup.string().required(),
          code:
            step.value === 'password'
              ? yup.string()
              : yup.string().trim().required(),
          saved_codes:
            step.value === 'setup'
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

function goToStep(next: Step) {
  step.value = next
  setFieldValue('code', '', false)
  setFieldValue('saved_codes', false, false)
  useRecoveryCode.value = false
  focusCode()
}

// Move the focus to the code input when it appears (no `autofocus`:
// the input is created dynamically, and it's discouraged for a11y)
function focusCode() {
  if (step.value === 'password') return
  nextTick(() => document.getElementById('code')?.focus())
}
watch(useRecoveryCode, focusCode)

function backToPassword() {
  setup.value = null
  stepFeedback.value = null
  goToStep('password')
}

const login = handleSubmit(async (form) => {
  loading.value = true
  stepFeedback.value = null

  const body: Record<string, string> = {
    credentials: form.username + ':' + form.password,
  }
  if (step.value !== 'password' && form.code) {
    body.twofactor_code = form.code.trim()
  }
  if (step.value === 'setup' && setup.value) {
    body.twofactor_setup_token = setup.value.setup_token
  }

  const { error } = await useApi('/login', { method: 'POST', body })
  loading.value = false

  if (!error.value) {
    if (redirectUrl.value) {
      await navigateTo(atob(redirectUrl.value), { external: true })
    }

    isLoggedIn.value = true
    await navigateTo('/')
    return
  }

  const challenge = parseTwoFactorChallenge(error.value.data)

  if (!challenge) {
    // Regular authentication failure (wrong username/password…)
    backToPassword()
    setErrors({
      username: t('possibly_invalid_username'),
      password: t('possibly_invalid_password'),
    })
    return
  }

  switch (challenge.error) {
    case 'twofactor_code_required':
      goToStep('code')
      break
    case 'twofactor_setup_required':
      setup.value = challenge as TwoFactorSetup
      goToStep('setup')
      break
    case 'twofactor_code_invalid':
      setFieldValue('code', '', false)
      setFieldError('code', 'twofactor.code_invalid')
      break
    case 'twofactor_setup_token_expired':
    case 'twofactor_setup_token_invalid':
      backToPassword()
      stepFeedback.value = t('twofactor.setup_expired')
      break
  }
})
</script>

<template>
  <main
    class="w-50 m-auto"
    :class="step === 'setup' ? 'max-w-[600px]' : 'max-w-[300px]'"
  >
    <CustomLogo class="flex-none mx-auto w-1/2 mb-10" />

    <BaseAlert
      v-if="redirectUrl"
      variant="warning"
      icon="alert-outline"
      :message="t('ssowat.protected')"
      class="mb-4"
      assertive
    />

    <BaseAlert
      v-if="queryMsg"
      variant="info"
      icon="login"
      :message="t(queryMsg)"
      class="mb-4"
      assertive
    />

    <BaseAlert
      v-if="stepFeedback"
      variant="warning"
      icon="alert-outline"
      :message="stepFeedback"
      class="mb-4"
      assertive
    />

    <form novalidate @submit="login">
      <!-- Step 1: username/password (kept in the form, hidden afterwards) -->
      <div v-show="step === 'password'">
        <FormField
          name="username"
          :label="t('username')"
          icon="account-circle"
          class="mb-4"
          row
        >
          <TextInput
            name="username"
            type="text"
            :placeholder="t('username')"
            autocomplete="username"
            autocapitalize="off"
            spellcheck="false"
            autofocus=""
            class="w-full"
          />
        </FormField>

        <FormField
          name="password"
          :label="t('password')"
          icon="lock"
          class="mb-4"
          row
        >
          <TextInput
            name="password"
            type="password"
            :placeholder="t('password')"
            autocomplete="current-password"
            class="w-full"
          />
        </FormField>
      </div>

      <!-- Step 2a: 2FA code -->
      <template v-if="step === 'code'">
        <p class="mb-4" aria-live="polite">
          {{
            useRecoveryCode
              ? t('twofactor.login_enter_recovery_code', {
                  username: values.username,
                })
              : t('twofactor.login_enter_code', { username: values.username })
          }}
        </p>
      </template>

      <!-- Step 2b: mandatory 2FA setup -->
      <template v-if="step === 'setup' && setup">
        <BaseAlert
          variant="info"
          icon="shield-lock"
          :message="t('twofactor.login_setup_required')"
          class="mb-6"
          assertive
        />
        <TwoFactorSetupInfo :setup="setup" />
      </template>

      <template v-if="step !== 'password'">
        <FormField
          name="code"
          :label="
            useRecoveryCode ? t('twofactor.recovery_code') : t('twofactor.code')
          "
          icon="shield-lock"
          class="mb-4"
          row
        >
          <TextInput
            :key="useRecoveryCode ? 'recovery' : 'totp'"
            name="code"
            type="text"
            :placeholder="
              useRecoveryCode
                ? 'xxxx-xxxx-xxxx'
                : t('twofactor.code_placeholder')
            "
            :inputmode="useRecoveryCode ? 'text' : 'numeric'"
            :autocomplete="useRecoveryCode ? 'off' : 'one-time-code'"
            autocapitalize="off"
            spellcheck="false"
            class="w-full font-mono"
          />
        </FormField>

        <FormField
          v-if="step === 'setup'"
          name="saved_codes"
          :label="t('twofactor.i_saved_recovery_codes')"
          class="mb-4"
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
      </template>

      <YButton
        :text="step === 'setup' ? t('twofactor.enable_and_login') : t('login')"
        type="submit"
        :disabled="loading"
        block
      />

      <div v-if="step !== 'password'" class="flex flex-col items-center mt-4">
        <button
          v-if="step === 'code'"
          type="button"
          class="link mb-2"
          @click="useRecoveryCode = !useRecoveryCode"
        >
          {{
            useRecoveryCode
              ? t('twofactor.use_authenticator_code')
              : t('twofactor.use_recovery_code')
          }}
        </button>
        <button type="button" class="link" @click="backToPassword">
          {{ t('cancel') }}
        </button>
      </div>
    </form>
  </main>
</template>
