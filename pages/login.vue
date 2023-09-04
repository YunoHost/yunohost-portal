<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

definePageMeta({
  layout: false,
  public: true,
})

const { t } = useI18n()
const isLoggedIn = useIsLoggedIn()

const { handleSubmit, setErrors } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      username: yup.string().required(),
      password: yup.string().required(),
    }),
  ),
})

const login = handleSubmit(async (form) => {
  const { error } = await useApi('/login', {
    method: 'POST',
    body: { credentials: form.username + ':' + form.password },
  })

  if (!error.value) {
    const redirectUrl = useRedirectUrl().value

    if (redirectUrl) {
      await navigateTo(atob(redirectUrl), { external: true })
    }

    isLoggedIn.value = true
    await navigateTo('/')
  } else {
    setErrors({
      username: t('possibly_invalid_username'),
      password: t('possibly_invalid_password'),
    })
  }
})
</script>

<template>
  <main class="w-50 m-auto">
    <img
      class="flex-none mx-auto w-1/2 mb-10"
      src="/assets/img/logo-white.svg"
    />

    <form novalidate @submit="login">
      <FormField
        name="username"
        :label="t('username')"
        icon="mdi:account-circle"
        class="mb-4"
        row
      >
        <TextInput
          name="username"
          type="text"
          :placeholder="t('username')"
          autocomplete="username"
        />
      </FormField>

      <FormField
        name="password"
        :label="t('password')"
        icon="mdi:lock"
        class="mb-4"
        row
      >
        <TextInput
          name="password"
          type="password"
          :placeholder="t('password')"
          autocomplete="current-password"
        />
      </FormField>

      <YButton :text="t('login')" type="submit" block />
    </form>
  </main>
</template>
