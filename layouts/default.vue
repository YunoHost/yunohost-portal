<script setup lang="ts">
import type { User } from '@/composables/states'

const { t } = useI18n()
const isLoggedIn = useIsLoggedIn()
const settings = await useSettings()
const user = await useUser<User | null>()
const skipLink: Ref<HTMLLinkElement | null> = ref(null)
const colorMode = useColorMode()
const themes = [
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
]

const footerLinks = [
  { text: t('footerlink_edit'), to: '/edit' },
  {
    text: t('footerlink_documentation'),
    to: '//yunohost.org/user_guide',
    newWindow: true,
  },
  { text: t('footerlink_support'), to: '//yunohost.org/help', newWindow: true },
  {
    text: t('footerlink_administration'),
    to: '/yunohost/admin/',
    newWindow: true,
  },
]

async function logout() {
  const { error } = await useApi('/logout')

  if (!error.value) {
    // Delete user infos
    user.value = null
    isLoggedIn.value = false
    await navigateTo(settings.value.public ? '/' : '/login')
  } else {
    // FIXME : display an error or something
  }
}
</script>

<template>
  <div class="container mx-auto p-10 min-h-screen flex flex-col">
    <header class="py-2">
      <div class="h-10 -mt-10">
        <a
          id="skip-link"
          ref="skipLink"
          class="link sr-only focus:not-sr-only"
          href="#main-target"
          >{{ $t('skip_to_main_content') }}</a
        >
      </div>

      <slot name="header">
        <div class="flex flex-row flex-wrap items-center min-w-full">
          <NuxtLink to="/">
            <span class="sr-only">{{ t('back_to_apps') }}</span>
            <YIcon name="account-circle" size="5em" class="mr-3" />
          </NuxtLink>

          <div>
            <h2 class="text-2xl font-extrabold leading-none tracking-tight">
              {{ user?.username || t('visitor') }}
            </h2>
            <h3 v-if="user">{{ user.fullname }}</h3>
            <h4 v-if="user" class="opacity-50">{{ user.mail }}</h4>
          </div>

          <!-- FIXME temp -->
          <div class="ml-auto mr-4">
            <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
            <label class="mr-4">theme:</label>
            <select
              v-model="colorMode.preference"
              class="select select-bordered"
            >
              <option disabled selected>Theme</option>
              <option v-for="theme of themes" :key="theme">{{ theme }}</option>
            </select>
          </div>

          <YButton
            v-if="isLoggedIn"
            icon="logout"
            :text="t('logout')"
            @click.prevent="logout"
          />
          <YButton v-else icon="login" :text="t('login')" to="/login" />
        </div>
      </slot>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-auto">
      <!-- class="container fixed bottom-10 mx-10 pr-10 text-gray-400" -->
      <slot name="footer">
        <div class="sm:flex flex-row flex-wrap items-end justify-center">
          <nav
            class="border-t border-gray-500 space-x-5 flex-wrap sm:mr-5 text-center sm:text-left"
          >
            <NuxtLink
              v-for="link in footerLinks"
              :key="link.to"
              :to="link.to"
              :target="link.newWindow ? '_blank' : undefined"
              class="link link-hover text-base-content inline-block"
            >
              {{ link.text }}
            </NuxtLink>
          </nav>

          <CustomLogo class="mt-8 sm:mt-0 mx-auto sm:ml-auto sm:mr-0" />
        </div>
      </slot>
    </footer>
  </div>
</template>
