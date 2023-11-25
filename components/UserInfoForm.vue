<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { pick } from '@/utils/common'
import type { User } from '@/composables/states'
import type { Feedback } from '@/composables/form'

const { t } = useI18n()

const user = await useUser()
const loading: Ref<boolean | null> = ref(false)
const feedback: Ref<Feedback> = ref(null)

const { handleSubmit, setFieldError, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      fullname: yup.string().required().min(2),
      mailalias: yup.array().of(yup.string().email().required()).required(),
      mailforward: yup.array().of(yup.string().email().required()).required(),
    }),
  ),
  initialValues: {
    ...pick(user.value, 'fullname', 'mailalias', 'mailforward'),
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

  const { error, data } = await useApi<
    Pick<User, 'fullname' | 'mailalias' | 'mailforward'>
  >('/update', {
    method: 'PUT',
    body: form,
  })

  if (error.value) {
    // Reset form dirty state but keep previous values
    resetForm({ values: form })
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
    Object.assign(user.value, data)
    resetForm({
      values: data.value,
    })
    feedback.value = {
      variant: 'success',
      icon: 'thumb-up',
      message: t('user_profile_updated'),
    }
  }

  loading.value = false
})
</script>

<template>
  <YForm :loading="loading" :feedback="feedback" @submit.prevent="onSubmit">
    <FormField name="fullname" :label="$t('fullname')" class="mb-10">
      <TextInput
        name="fullname"
        type="text"
        :placeholder="$t('fullname')"
        autocomplete="name"
        class="w-full"
      />
    </FormField>

    <TextInputList
      name="mailalias"
      type="email"
      :label="$t('mail_addresses')"
      :input-label="$t('mail_address')"
      :button-label="$t('add_mail')"
      :placeholder="$t('new_mail')"
      class="mb-10"
    />

    <TextInputList
      name="mailforward"
      type="email"
      :label="$t('mail_forwards')"
      :input-label="$t('mail_forward')"
      :button-label="$t('add_forward')"
      :placeholder="$t('new_forward')"
    />
  </YForm>
</template>
