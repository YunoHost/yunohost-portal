<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

const me = await useUserInfo()

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      username: yup.string(),
      fullname: yup.string().required().min(1),
      mailAliases: yup.array().of(yup.string().email()),
      mailForward: yup.array().of(yup.string().email()),
    }),
  ),
  initialValues: {
    username: me.value.username,
    fullname: me.value.fullname,
    mailAliases: me.value['mail-aliases'].length
      ? me.value['mail-aliases']
      : [''],
    mailForward: me.value['mail-forward'].length
      ? me.value['mail-forward']
      : [''],
  },
})

const onSubmit = handleSubmit((form) => {
  console.log('SUBMIT user edit', form)
})
</script>

<template>
  <!-- {{ initialValues }} -->
  <form novalidate @submit="onSubmit">
    <div class="flex justify-between">
      <div class="w-1/3">
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

      <div class="basis-1/2">
        <FormField
          name="mailAliases"
          :label="$t('mail_addresses')"
          class="mb-10"
        >
          <TextInputList
            name="mailAliases"
            type="text"
            :placeholder="$t('new_mail')"
          />
        </FormField>

        <FormField name="mailForward" :label="$t('mail_forward')">
          <TextInputList
            name="mailForward"
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
      <YButton :text="$t('ok')" type="submit" variant="success" />
    </div>
  </form>
</template>
