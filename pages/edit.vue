<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { pick, exclude } from '@/utils/common'
import type { UserData } from '@/composables/api'

const { t } = useI18n()
const { userData, update } = await useUserInfo()

const loading: Ref<boolean | null> = ref(false)
const feedback: Ref<{
  variant: 'success' | 'warning' | 'error'
  icon: string
  message: string
} | null> = ref(null)

const { handleSubmit, setFieldError, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      // username: yup.string().required(),
      fullname: yup.string().required().min(2),
      currentPassword: yup
        .string()
        .when('newPassword', ([newPassword], schema) => {
          return newPassword ? schema.required() : schema
        }),
      newPassword: yup.string().matches(/.{8,}/, {
        excludeEmptyString: true,
        message: { key: 'v.string_too_short', values: { min: 8 } },
      }),
      confirmNewPassword: yup
        .string()
        .when('newPassword', ([newPassword], schema) => {
          return newPassword
            ? schema.oneOf([yup.ref('newPassword')], 'v.password_not_match')
            : schema
        }),
      mailalias: yup.array().of(yup.string().email().required()).required(),
      mailforward: yup.array().of(yup.string().email().required()).required(),
    }),
  ),
  initialValues: {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    ...pick(userData.value, 'fullname', 'mailalias', 'mailforward'),
  },
})

watch(
  () => meta.value.touched,
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
    Pick<UserData, 'fullname' | 'mailalias' | 'mailforward'>
  >('/update', {
    method: 'PUT',
    body: exclude(form, 'confirmNewPassword'),
  })

  if (error.value) {
    const errData = error.value.data
    if (errData.path) {
      setFieldError(errData.path, errData.error)
    } else {
      feedback.value = {
        variant: 'error',
        icon: 'mdi:alert',
        message: errData.error,
      }
    }
  } else if (data.value) {
    update(data.value)
    resetForm({
      values: {
        ...data.value,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
    })
    feedback.value = {
      variant: 'success',
      icon: 'mdi:thumb-up',
      message: t('user_profile_updated'),
    }
  }
  loading.value = false
})
</script>

<template>
  <div>
    <PageTitle :text="$t('footerlink_edit')" />

    <form novalidate class="my-10" @submit="onSubmit">
      <BaseAlert v-show="feedback" v-bind="feedback" class="mb-10" />

      <div class="lg:flex lg:justify-between">
        <div class="lg:w-1/2 lg:me-20">
          <!-- <FormField name="username" :label="$t('username')" class="mb-3">
            <TextInput
              name="username"
              type="text"
              :placeholder="$t('username')"
              disabled
              class="w-full"
            />
          </FormField> -->

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
            :placeholder="$t('new_mail')"
            class="mb-10"
          />

          <TextInputList
            name="mailforward"
            type="email"
            :label="$t('mail_forwards')"
            :input-label="$t('mail_forward')"
            :placeholder="$t('new_forward')"
          />
        </div>

        <fieldset class="basis-1/2 mt-10 lg:mt-0">
          <legend class="text-xl mb-3">{{ $t('change_password') }}</legend>

          <FormField
            name="currentPassword"
            :label="$t('current_password')"
            class="mb-3"
          >
            <TextInput
              name="currentPassword"
              type="password"
              autocomplete="current-password"
              class="w-full"
            />
          </FormField>

          <FormField
            name="newPassword"
            :label="$t('new_password')"
            :description="$t('good_practices_about_user_password')"
            class="mb-3"
          >
            <TextInput
              name="newPassword"
              type="password"
              autocomplete="new-password"
              class="w-full"
            />
          </FormField>

          <FormField
            name="confirmNewPassword"
            :label="$t('confirm_new_password')"
          >
            <TextInput
              name="confirmNewPassword"
              type="password"
              class="w-full"
            />
          </FormField>
        </fieldset>
      </div>

      <!-- SR "loading" announcement -->
      <BaseAlert
        :message="loading ? $t('api.processing') : ''"
        class="sr-only"
        assertive
      />

      <div class="flex mt-10">
        <NuxtLink to="/" class="btn ml-auto me-2">
          {{ $t('cancel') }}
        </NuxtLink>
        <SubmitButton :loading="loading" variant="success" />
      </div>
    </form>
  </div>
</template>
