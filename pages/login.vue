<script setup lang="ts">
import * as yup from 'yup'

definePageMeta({
  layout: false,
})

const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
})
const { t } = useI18n()
const isLoggedIn = useIsLoggedIn()

async function login(form) {
  const { error } = await useApi('/login', {
    method: 'POST',
    body: { credentials: form.username + ':' + form.password },
  })

  if (!error.value) {
    isLoggedIn.value = true
    await navigateTo('/')
  } else {
    // FIXME : display an error or something
  }
}

const schema = {
  username: yup.string().required(),
  password: yup.string().required(),
}
</script>

<template>
  <main class="w-50 m-auto">
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir"></Html>
    <img
      class="flex-none mx-auto w-1/2 mb-10"
      src="/assets/img/logo-white.svg"
    />

    <BaseForm :schema="schema" @submit="login">
      <FormField
        name="username"
        :label="t('username')"
        icon="mdi:account-circle"
        class="mb-4"
      >
        <TextInput name="username" type="text" :placeholder="t('username')" />
      </FormField>

      <FormField
        name="password"
        :label="t('password')"
        icon="mdi:lock"
        class="mb-4"
      >
        <TextInput
          name="password"
          type="password"
          :placeholder="t('password')"
        />
      </FormField>

      <YButton :text="t('login')" type="submit" block />
    </BaseForm>
  </main>
</template>

<style>
/* FIXME add in css file */
body {
  font-family: 'Source Sans 3';
}

#__nuxt {
  @apply min-h-screen flex;
}
</style>
