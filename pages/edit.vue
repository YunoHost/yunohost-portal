<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { pick, exclude } from '@/utils/common'
import type { User } from '@/composables/states'

const { t, locale, locales } = useI18n()

useHead({
  title: t('footerlink_edit'),
})

const user = await useUser()

// Browser
const localesAsOptions = computed(() => {
  return locales.value.map((locale) => ({
    text: locale.name,
    value: locale.code,
  }))
})

const colorMode = useColorMode()
const themesAsOptions = [
  'system',
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
].map((theme) => ({
  text: theme.charAt(0).toUpperCase() + theme.slice(1),
  value: theme,
}))
// Server
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
      icon: 'thumb-up',
      message: t('user_profile_updated'),
    }
  }
  loading.value = false
})
</script>

<template>
  <div>
    <PageTitle :text="$t('footerlink_edit')" />

    <section>
      <h2 class="text-3xl">{{ t('edit_personal_settings') }}</h2>

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

            <FormField
              name="confirmpassword"
              :label="$t('confirm_new_password')"
            >
              <TextInput
                name="confirmpassword"
                type="password"
                class="w-full"
              />
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
          <NuxtLink to="/" class="btn ms-auto me-2">
            {{ $t('cancel') }}
          </NuxtLink>
          <SubmitButton :loading="loading" variant="success" />
        </div>
      </form>
    </section>

    <section class="my-10">
      <h2 class="text-4xl font-bold">{{ t('edit_browser_settings') }}</h2>

      <form novalidate class="my-10" @submit.prevent>
        <div role="group" class="flex align mb-3">
          <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
          <label for="language" class="label me-3">{{ t('language') }}</label>
          <select id="language" v-model="locale" class="select select-bordered">
            <option disabled selected>{{ t('language') }}</option>
            <option
              v-for="option in localesAsOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>

        <div role="group" class="flex align">
          <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
          <label for="theme" class="label me-3">{{ t('theme') }}</label>
          <select
            id="theme"
            v-model="colorMode.preference"
            class="select select-bordered"
          >
            <option disabled selected>{{ t('theme') }}</option>
            <option
              v-for="option in themesAsOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
      </form>
    </section>
  </div>
</template>
