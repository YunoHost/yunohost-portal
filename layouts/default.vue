<script setup lang="ts">
import type { User } from '@/composables/states'

const { t } = useI18n()
const isLoggedIn = useIsLoggedIn()
const settings = await useSettings()
const user = await useUser<User | null>()
const skipLink: Ref<HTMLLinkElement | null> = ref(null)

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
        <div class="flex flex-row items-center">
          <NuxtLink to="/" class="me-5">
            <span class="sr-only">{{ t('back_to_apps') }}</span>
            <CustomLogo class="logo" />
          </NuxtLink>

          <div
            class="flex min-[500px]:w-full max-[500px]:flex-col max-[500px]:ms-auto"
          >
            <div>
              <h2 class="text-2xl font-extrabold leading-none tracking-tight">
                {{ user?.username || t('visitor') }}
              </h2>
              <h3 v-if="user">{{ user.fullname }}</h3>
              <h4 v-if="user" class="opacity-50">{{ user.mail }}</h4>
            </div>

            <div class="min-[500px]:ms-auto max-[500px]:mt-2">
              <YButton
                v-if="isLoggedIn"
                icon="logout"
                :text="t('logout')"
                @click.prevent="logout"
              />
              <YButton v-else icon="login" :text="t('login')" to="/login" />
            </div>
          </div>
        </div>
      </slot>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-auto">
      <slot name="footer">
        <nav
          class="flex pt-2 flex-col border-t border-gray-500 flex-wrap text-center sm:space-x-5 sm:flex-row sm:inline-flex"
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
      </slot>
    </footer>
  </div>
</template>

<style scoped>
header .logo {
  width: 100px;
}
</style>
