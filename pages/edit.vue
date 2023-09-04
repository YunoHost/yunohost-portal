<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { pick, exclude } from '@/utils/common'
import type { User } from '@/composables/states'

const { t } = useI18n()
const user = await useUser()

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
      currentpassword: yup
        .string()
        .when('newpassword', ([newpassword], schema) => {
          return newpassword ? schema.required() : schema
        }),
      newpassword: yup.string().matches(/.{8,}/, {
        excludeEmptyString: true,
        message: { key: 'v.string_too_short', values: { min: 8 } },
      }),
      confirmpassword: yup
        .string()
        .when('newpassword', ([newpassword], schema) => {
          return newpassword
            ? schema.oneOf([yup.ref('newpassword')], 'v.password_not_match')
            : schema
        }),
      mailalias: yup.array().of(yup.string().email().required()).required(),
      mailforward: yup.array().of(yup.string().email().required()).required(),
    }),
  ),
  initialValues: {
    currentpassword: '',
    newpassword: '',
    confirmpassword: '',
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
    body: exclude(form, 'confirmpassword'),
  })

  if (error.value) {
    // Reset form dirty state but keep previous values
    resetForm({ values: form })
    const errData = error.value.data
    if (errData.path) {
      setFieldError(errData.path, errData.error)
    } else {
      feedback.value = {
        variant: 'error',
        icon: 'mdi:alert',
        message: errData.error || errData,
      }
    }
  } else if (data.value) {
    // redirect on password change
    if (form.newpassword) {
      useIsLoggedIn().value = false
      return navigateTo('/login')
    }

    Object.assign(user.value, data)
    resetForm({
      values: {
        ...data.value,
        currentpassword: '',
        newpassword: '',
        confirmpassword: '',
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
        </fieldset>
      </div>

      <!-- Success + generic error announcement -->
      <BaseAlert v-show="feedback" v-bind="feedback" class="mb-10" />

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
