<script setup lang="ts">
const { t, locales, getBrowserLocale } = useI18n()

useHead({
  title: t('footerlink_edit'),
})

const preferedLocale = usePreferedLocale()

const localesAsOptions = computed(() => {
  const options = locales.value.map((locale) => ({
    text: locale.name,
    value: locale.code,
  }))
  const browserLocale = getBrowserLocale()
  const browserLocaleName = locales.value.find(
    (locale) => locale.code === browserLocale,
  )?.name
  options.unshift({
    text: t('automatic', { name: browserLocaleName }),
    value: 'auto',
  })

  return options
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
</script>

<template>
  <div>
    <PageTitle :text="$t('footerlink_edit')" />

    <div class="lg:flex lg:justify-between">
      <section
        class="lg:w-1/2 lg:me-20 h-full card card-body border border-neutral my-10"
      >
        <h2 class="text-3xl mb-3">{{ t('edit_personal_settings') }}</h2>

        <UserInfoForm />
      </section>

      <section class="lg:w-1/2 card card-body border border-neutral my-10">
        <h2 class="text-3xl mb-3">{{ $t('change_password') }}</h2>

        <UserPasswordForm />
      </section>
    </div>

    <section class="card card-body border border-neutral my-10">
      <h2 class="text-3xl mb-3">{{ t('edit_browser_settings') }}</h2>

      <form novalidate @submit.prevent>
        <div role="group" class="flex align mb-3">
          <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
          <label for="language" class="label me-3">{{ t('language') }}</label>
          <select
            id="language"
            v-model="preferedLocale"
            class="select select-bordered"
          >
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
