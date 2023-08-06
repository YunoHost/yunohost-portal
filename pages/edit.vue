<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import type { UserData } from '@/composables/api'

const { userData, update } = await useUserInfo()

const { handleSubmit, setFieldError } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      username: yup.string().required(),
      fullname: yup.string().required().min(1),
      mailalias: yup.array().of(yup.string().email().required()),
      mailforward: yup.array().of(yup.string().email().required()),
    }),
  ),
  initialValues: {
    username: userData.value.username,
    fullname: userData.value.fullname,
    mailalias: userData.value.mailalias.length
      ? userData.value.mailalias
      : [''],
    mailforward: userData.value.mailforward.length
      ? userData.value.mailforward
      : [''],
  },
})

const onSubmit = handleSubmit(async (form) => {
  const { data, error } = await useApi<UserData>('/update', {
    method: 'PUT',
    body: form,
  })

  if (error.value) {
    setFieldError(error.value.data.path, error.value.data.error_key)
  } else if (data.value) {
    update(data.value)
  }
})
</script>

<template>
  <div>
    <PageTitle :text="$t('footerlink_edit')" />

    <form novalidate class="my-10" @submit="onSubmit">
      <div class="sm:flex sm:justify-between">
        <div class="sm:w-1/3">
          <FormField name="username" :label="$t('username')" class="mb-3">
            <TextInput
              name="username"
              type="text"
              :placeholder="$t('username')"
              disabled
              class="w-full"
            />
          </FormField>

          <FormField name="fullname" :label="$t('fullname')">
            <TextInput
              name="fullname"
              type="text"
              :placeholder="$t('fullname')"
              autocomplete="name"
              class="w-full"
            />
          </FormField>
        </div>

        <div class="basis-1/2 mt-10 sm:mt-0">
          <FormField
            name="mailalias"
            :label="$t('mail_addresses')"
            class="mb-10"
          >
            <TextInputList
              name="mailalias"
              type="text"
              :placeholder="$t('new_mail')"
            />
          </FormField>

          <FormField name="mailforward" :label="$t('mail_forward')">
            <TextInputList
              name="mailforward"
              type="text"
              :placeholder="$t('new_forward')"
            />
          </FormField>
        </div>
      </div>

      <div class="flex mt-10">
        <NuxtLink to="/password" class="btn btn-primary">
          {{ $t('change_password') }}
        </NuxtLink>
        <NuxtLink to="/" class="btn ml-auto mr-2">
          {{ $t('cancel') }}
        </NuxtLink>
        <YButton :text="$t('save')" type="submit" variant="success" />
      </div>
    </form>
  </div>
</template>
