<script setup lang="ts">
const { t, locales, getBrowserLocale } = useI18n()

useHead({
  title: t('footerlink_edit'),
})

const settings = await useSettings()
const preferedTheme = await usePreferedTheme()
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

const { colors, sizes } = useThemeOverride()

const themesAsOptions = [
  'auto',
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
  text:
    theme !== 'auto'
      ? theme.charAt(0).toUpperCase() + theme.slice(1)
      : t('automatic', { name: settings.value.portal_theme }),
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
            v-model="preferedTheme"
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

        <fieldset class="theme-override mt-8">
          <legend class="text-xl mb-6">{{ $t('theming.override') }}</legend>

          <div
            v-for="(_, colorName) in colors"
            :key="colorName"
            class="flex flex-wrap mb-2"
          >
            <FormField
              :name="`color-picker-${colorName}`"
              :label="
                $t('theming.color_picker', {
                  colorName: $t(`theming.colors.${colorName}`),
                })
              "
              sr-hide-label
            >
              <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
              <input
                :id="`color-picker-${colorName}`"
                v-model="colors[colorName]"
                type="color"
                class="inline-block w-8 h-8 -mr-8 cursor-pointer"
              />
              <div
                :class="'bg-' + colorName"
                class="inline-block w-8 h-8 pointer-events-none border border-base-300"
              />
            </FormField>

            <FormField
              :name="`color-hex-${colorName}`"
              :label="
                $t('theming.color_hex', {
                  colorName: $t(`theming.colors.${colorName}`),
                })
              "
              sr-hide-label
            >
              <input
                :id="`color-hex-${colorName}`"
                v-model="colors[colorName]"
                size="7"
                class="input input-bordered px-2 font-mono ml-3"
              />
            </FormField>

            <span class="ml-3" aria-hidden>
              {{ $t(`theming.colors.${colorName}`) }}
            </span>
          </div>

          <div v-for="(_, sizeName) in sizes" :key="sizeName" class="flex mb-2">
            <FormField
              :name="`size-${sizeName}`"
              :label="
                $t('theming.size', {
                  sizeName: $t(`theming.sizes.${sizeName}`),
                })
              "
              sr-hide-label
            >
              <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
              <input
                :id="`size-${sizeName}`"
                v-model="sizes[sizeName]"
                type="number"
                size="6"
                class="input input-bordered inline-block pe-1"
              />
              <span class="ml-3" aria-hidden>
                {{ $t(`theming.sizes.${sizeName}`) }}
              </span>
            </FormField>
          </div>
        </fieldset>
      </form>
    </section>
  </div>
</template>

<style scoped>
.theme-override input.input {
  min-height: 2rem;
  height: 2rem;
}
</style>
