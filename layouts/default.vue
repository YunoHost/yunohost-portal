<script setup lang="ts">
import type { User } from '@/composables/states'

const { t } = useI18n()
const isLoggedIn = useIsLoggedIn()
const queryMsg = useQueryMsg()
const settings = await useSettings()
const user = await useUser<User | null>()

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
    to: `//${settings.value.domain}/yunohost/admin/`,
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
    <BaseAlert
      v-if="queryMsg"
      variant="warning"
      icon="alert-outline"
      :message="t('ssowat.' + queryMsg)"
      class="mb-4"
      assertive
    />

    <header class="py-2">
      <div id="focus-reset" class="h-10 -mt-10 focus-target" tabindex="-1">
        <a class="link sr-only focus:not-sr-only" href="#main-target">
          {{ $t('skip_link.main_content') }}
        </a>
        <a
          v-if="isLoggedIn"
          class="link sr-only focus:not-sr-only"
          href="#main-footer"
        >
          {{ $t('skip_link.footer') }}
        </a>
      </div>

      <slot name="header">
        <div class="flex flex-row items-center">
          <NuxtLink to="/" class="me-5">
            <span class="sr-only">{{ t('back_to_apps') }}</span>
            <CustomLogo class="logo" />
          </NuxtLink>

          <div
            class="flex flex-grow flex-wrap min-[500px]:w-full max-[500px]:flex-col max-[500px]:ms-auto"
          >
            <div v-if="user" class="flex-grow">
              <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events vuejs-accessibility/no-static-element-interactions -->
              <div
                class="profile cursor-pointer flex flex-col"
                @click="navigateTo('/edit')"
              >
                <span>
                  <span
                    class="text-2xl font-extrabold tracking-tight leading-none"
                  >
                    {{ user.username }}
                  </span>
                  <YIcon name="pencil" size="1.25em" class="ms-2" />
                </span>
                <span class="leading-none">{{ user.fullname }}</span>
                <span class="opacity-50">{{ user.mail }}</span>
                <NuxtLink to="/edit" class="link sr-only focus:not-sr-only">
                  {{ t('footerlink_edit') }}
                </NuxtLink>
              </div>
            </div>
            <p
              v-else-if="settings.portal_title"
              class="text-3xl font-bold flex-grow min-[800px]:text-center mb-3"
            >
              {{ settings.portal_title }}
            </p>

            <div class="max-[500px]:mt-2">
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

    <footer
      v-if="isLoggedIn"
      id="main-footer"
      class="mt-auto focus-target border-t border-gray-500"
      tabindex="-1"
    >
      <slot name="footer">
        <nav
          class="flex pt-2 flex-col flex-wrap text-center sm:space-x-5 sm:flex-row sm:inline-flex"
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

header .profile:not(:hover) .nuxt-icon {
  display: none;
}

.focus-target:not(:focus-visible) {
  outline: none;
}

#focus-reset {
  outline: none;
}
</style>
