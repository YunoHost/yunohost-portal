<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      current: yup.string().min(8),
      password: yup.string().required().min(8),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')])
        .required(),
    }),
  ),
})

const onSubmit = handleSubmit(async (form) => {
  const { error } = await useApi('/me/update_password', {
    method: 'PUT',
    body: { current: form.current, password: form.password },
  })
  if (!error.value) {
    useIsLoggedIn().value = false
    navigateTo('/login')
  } else {
    // FIXME display generic error
  }
})
</script>

<template>
  <form novalidate @submit="onSubmit">
    <!-- FIXME replace with accessible component -->
    <div role="alert" class="alert alert-warning mb-10">
      <Icon name="mdi:warning-outline" size="2em" />
      {{ $t('good_practices_about_user_password') }}
    </div>

    <div class="md:flex">
      <div class="basis-1/2 mb-10 md:mr-10">
        <FormField name="current" :label="$t('current_password')">
          <TextInput
            name="current"
            type="password"
            autocomplete="currrent-password"
            class="w-full"
          />
        </FormField>
      </div>

      <div class="basis-1/2 md:ml-10">
        <FormField name="password" :label="$t('new_password')" class="mb-3">
          <TextInput
            name="password"
            type="password"
            autocomplete="new-password"
            class="w-full"
          />
        </FormField>

        <FormField name="confirmPassword" :label="$t('confirm_new_password')">
          <TextInput
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            class="w-full"
          />
        </FormField>
      </div>
    </div>

    <div class="flex mt-10">
      <NuxtLink to="/" class="btn ml-auto mr-2">
        {{ $t('cancel') }}
      </NuxtLink>
      <YButton :text="$t('ok')" type="submit" variant="success" />
    </div>
  </form>
</template>
