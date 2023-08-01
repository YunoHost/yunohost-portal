<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
})
const { t } = useI18n()
const isLoggedIn = useIsLoggedIn()
const { userData: me } = await useUserInfo()

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
    to: '//yunohost.org/docs',
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
    // FIXME : meh, turns out the cookie is still valid after successfully calling the route for some reason ... !?
    isLoggedIn.value = false
    await navigateTo('/login')
  } else {
    // FIXME : display an error or something
  }
}
</script>

<template>
  <div class="container mx-auto p-10 min-h-screen flex flex-col">
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir"></Html>

    <header class="py-10">
      <slot name="header">
        <div class="flex flex-row flex-wrap items-center min-w-full">
          <NuxtLink to="/">
            <span class="sr-only">{{ t('back_to_apps') }}</span>
            <Icon name="mdi:account-circle" size="5em" class="mr-3" />
          </NuxtLink>

          <div>
            <h2 class="text-2xl font-extrabold leading-none tracking-tight">
              {{ me.username }}
            </h2>
            <h3>{{ me.fullname }}</h3>
            <h4 class="opacity-50">{{ me.mail }}</h4>
          </div>

          <!-- FIXME temp -->
          <div class="ml-auto mr-4">
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
            icon="mdi:logout"
            :text="t('logout')"
            @click.prevent="logout"
          />
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

          <img
            src="/assets/img/logo-white.svg"
            class="mt-8 sm:mt-0 mx-auto sm:ml-auto sm:mr-0"
          />
        </div>
      </slot>
    </footer>
  </div>
</template>

<style>
body {
  font-family: 'Source Sans 3';
}
</style>
