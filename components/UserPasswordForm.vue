<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { exclude } from '@/utils/common'
import type { Feedback } from '@/composables/form'

const { t } = useI18n()

const settings = await useSettings()
const user = await useUser()
// Length, digits, lowers, uppers, others
// Sync this data with src/utils/password.py
const strengthLevels: Array = [
    [1, 0, 0, 0, 0],
    [8, 0, 0, 0, 0],
    [8, 1, 1, 1, 0],
    [8, 1, 1, 1, 1],
    [10, 1, 1, 1, 1],
    [12, 1, 1, 1, 1],
    [15, 1, 1, 1, 1],
    [30, 0, 1, 0, 0],
]
let strengthLevel: string
if (user.value.groups.includes("admins"))
    strengthLevel = settings.value.admin_strength
else
    strengthLevel = settings.value.user_strength
let passwordMin = strengthLevels[Number(strengthLevel) + 1][0]
const loading: Ref<boolean> = ref(false)
const feedback: Ref<Feedback> = ref(null)

const { handleSubmit, setFieldError, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      currentpassword: yup.string().required(),
      newpassword: yup
        .string()
        .max(126, 
          { key: 'v.string_too_long', values: { max: 126 }})
        .min(passwordMin, 
          { key:'v.string_too_short', values: { min: passwordMin } }
        )
        .required(),
      confirmpassword: yup
        .string()
        .oneOf([yup.ref('newpassword')], 'v.password_not_match')
        .required(),
    }),
  ),
  initialValues: {
    currentpassword: '',
    newpassword: '',
    confirmpassword: '',
  },
})

watch(
  () => meta.value.dirty,
  (value) => {
    // remove global feedback on edition
    if (value) {
      feedback.value = null
    }
  },
)

const onSubmit = handleSubmit(async (form) => {
  loading.value = true

  const { error } = await useApi('/update', {
    method: 'PUT',
    body: exclude(form, 'confirmpassword'),
  })

  if (error.value) {
    // Reset form dirty state and remove previous entries
    resetForm({
      values: { currentpassword: '', newpassword: '', confirmpassword: '' },
    })
    const errData = error.value.data
    let message

    if (errData.path) {
      setFieldError(errData.path, errData.error)
      message = t('form_has_errors')
    } else {
      message = errData.error || errData
    }
    feedback.value = {
      variant: 'error',
      icon: 'alert',
      message,
    }
  } else {
    // reset loggedin state and redirect to login
    useIsLoggedIn().value = false
    return navigateTo({
      path: '/login',
      query: { msg: 'password_changed_reconnect' },
    })
  }

  loading.value = false
})
</script>

<template>
  <YForm :loading="loading" :feedback="feedback" @submit.prevent="onSubmit">
    <FormField
      name="currentpassword"
      :label="$t('current_password')"
      class="mb-3"
    >
      <TextInput
        name="currentpassword"
        type="password"
        autocomplete="current-password"
        class="w-full"
      />
    </FormField>

    <FormField
      name="newpassword"
      :label="$t('new_password')"
      :description="$t('good_practices_about_user_password', {min: passwordMin})"
      class="mb-3"
    >
      <TextInput
        name="newpassword"
        type="password"
        autocomplete="new-password"
        class="w-full"
      />
    </FormField>

    <FormField name="confirmpassword" :label="$t('confirm_new_password')">
      <TextInput name="confirmpassword" type="password" class="w-full" />
    </FormField>
  </YForm>
</template>
