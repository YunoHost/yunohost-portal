<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { exclude } from '@/utils/common'
import type { Feedback } from '@/composables/form'

const { t } = useI18n()

const loading: Ref<boolean | null> = ref(false)
const feedback: Ref<Feedback> = ref(null)

const { handleSubmit, setFieldError, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      currentpassword: yup.string().required(),
      newpassword: yup
        .string()
        .matches(/.{8,}/, {
          excludeEmptyString: true,
          message: { key: 'v.string_too_short', values: { min: 8 } },
        })
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
    // remove loading and feedback on edition
    if (value) {
      loading.value = null
      feedback.value = null
    }
  },
)

const onSubmit = handleSubmit(async (form) => {
  loading.value = true

  const { error, data } = await useApi('/update', {
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
  } else if (data.value) {
    // reset loggedin state and redirect to login
    // FIXME toast ok message
    useIsLoggedIn().value = false
    return navigateTo('/login')
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
      :description="$t('good_practices_about_user_password')"
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
