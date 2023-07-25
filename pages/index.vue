<script setup lang="ts">
const { t } = useI18n()
const userData = await useUserInfo()

const me = computed(() => {
  const appTileColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-sky-500',
    'bg-purple-500',
    'bg-rose-500',
  ]
  if (!userData.value) return
  return {
    ...userData.value,
    apps: Object.entries(userData.value.apps).map(([id, app]) => {
      return {
        ...app,
        id,
        color: appTileColors[parseInt(app.label, 36) % appTileColors.length],
      }
    }),
  }
})
</script>

<template>
  <div v-if="me">
    <div id="apps" class="p-10">
      <div v-if="!me.apps.length">
        <em class="text-gray-400"
          >There is no app to list here, either because no web app yet is
          installed on the server, or because you don't have access to any.
          Please check with the admins of the server for more infos!</em
        >
      </div>

      <ul v-else class="flex space-x-4">
        <li
          v-for="app in me.apps"
          :key="app.id"
          :class="'text-center leading-none p-5 card h-32 w-32 ' + app.color"
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
