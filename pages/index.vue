<script setup lang="ts">
const isLoggedIn = useIsLoggedIn()

const { data } = await useApi<{
  username: string
  fullname: string
  mail: string
  'mail-aliases': string[]
  'mail-forward': string[]
  groups: string[]
  apps: Record<string, { label: string; url: string }>
}>('/me')

const me = computed(() => {
  const appTileColors = [
    'red',
    'orange',
    'yellow',
    'lime',
    'green',
    'teal',
    'indigo',
    'sky',
    'purple',
    'rose',
  ]
  if (!data.value) return
  return {
    ...data.value,
    apps: Object.entries(data.value.apps).map(([id, app]) => {
      return {
        ...app,
        id,
        color: appTileColors[parseInt(app.label, 36) % appTileColors.length],
      }
    }),
  }
})

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
  <div v-if="me">
    <div class="flex flex-row items-center min-w-full">
      <span class="flex-none pr-5">
        <Icon name="mdi:account-circle" size="5em" class="text-gray-500" />
      </span>

      <div class="grow">
        <h2 class="text-2xl font-extrabold leading-none tracking-tight">
          {{ me.username }}
        </h2>
        <h3>{{ me.fullname }}</h3>
        <h4 class="opacity-50">{{ me.mail }}</h4>
      </div>

      <div class="flex-none">
        <button class="btn bg-gray-800" @click.prevent="logout">
          <Icon name="mdi:logout" class="text-gray-500" />
          Logout
        </button>
      </div>
    </div>

    <div id="apps" class="p-10">
      <div v-if="!me.apps.length">
        <em class="text-gray-400"
          >There is no app to list here, either because no web app yet is
          installed on the server, or because you don't have access to any.
          Please check with the admins of the server for more infos!</em
        >
      </div>

      <ul v-else class="flex space-x-4">
        <!-- NB : because of the usage of dynamic colors, gotta force tailwind to expose those, cf 'safelisting' -->
        <li
          v-for="app in me.apps"
          :key="app.id"
          :class="
            'text-center leading-none p-5 card h-32 w-32 bg-' +
            app.color +
            '-500'
          "
        >
          <a>
            <div class="text-6xl font-extrabold">
              {{ app.label.substring(0, 2) }}
            </div>
            <span class="leading-tight">{{ app.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
