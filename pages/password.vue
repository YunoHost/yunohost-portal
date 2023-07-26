<script setup lang="ts">
import * as yup from 'yup'

const schema = {
  currentPassword: yup.string(),
  newPassword: yup.string().required().min(8),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')])
    .required(),
}

function onSubmit(form) {
  console.log('SUBMIT user password edit', form)
}
</script>

<template>
  <BaseForm :schema="schema" @submit="onSubmit">
    <!-- FIXME replace with accessible component -->
    <div role="alert" class="alert alert-warning mb-10">
      <Icon name="mdi:warning-outline" size="2em" />
      {{ $t('good_practices_about_user_password') }}
    </div>

    <div class="md:flex">
      <div class="basis-1/2 mb-10 md:mr-10">
        <FormField name="currentPassword" :label="$t('current_password')">
          <TextInput name="username" type="text" class="w-full" />
        </FormField>
      </div>

      <div class="basis-1/2 md:ml-10">
        <FormField name="newPassword" :label="$t('new_password')" class="mb-3">
          <TextInput name="newPassword" type="text" class="w-full" />
        </FormField>

        <FormField
          name="confirmNewPassword"
          :label="$t('confirm_new_password')"
        >
          <TextInput name="confirmNewPassword" type="text" class="w-full" />
        </FormField>
      </div>
    </div>

    <div class="flex mt-10">
      <NuxtLink to="/" class="btn ml-auto mr-2">
        {{ $t('cancel') }}
      </NuxtLink>
      <YButton :text="$t('ok')" type="submit" variant="success" />
    </div>
  </BaseForm>
</template>
