<script setup lang="ts">
definePageMeta({
  public: true,
})

const { t } = useI18n()
const appsData = await useApps()

useHead({
  title: t('app_list'),
})

const apps = computed(() => {
  const appTileColors = [
    ['bg-primary', 'text-primary-content'],
    ['bg-secondary', 'text-secondary-content'],
    ['bg-accent', 'text-accent-content'],
    ['bg-neutral', 'text-neutral-content'],
    ['bg-info', 'text-info-content'],
    ['bg-success', 'text-success-content'],
    ['bg-warning', 'text-warning-content'],
    ['bg-error', 'text-error-content'],
    // FIXME currently using daisyui theme colors,
    // if we want more colors we need to adapt those to every themes.
    // ['bg-red-500', 'text-red-100'],
    // ['bg-orange-500', 'text-orange-100'],
    // ['bg-yellow-500', 'text-yellow-100'],
    // ['bg-lime-500', 'text-lime-100'],
    // ['bg-green-500', 'text-green-100'],
    // ['bg-teal-500', 'text-teal-100'],
    // ['bg-indigo-500', 'text-indigo-100'],
    // ['bg-primary', 'text-primary-content'],
    // ['bg-purple-500', 'text-purple-100'],
    // ['bg-rose-500', 'text-rose-100'],
  ]

  return Object.entries(appsData.value).map(([id, app]) => {
    return {
      ...app,
      id,
      url: '//' + app.url,
      colors: appTileColors[parseInt(app.label, 36) % appTileColors.length],
    }
  })
})
</script>

<template>
  <div>
    <PageTitle :text="$t('app_list')" />

    <div id="apps">
      <div v-if="!apps.length" class="w-2/3">
        <em>{{ t('no_apps') }}</em>
      </div>

      <ul v-else class="tile-container">
        <li
          v-for="app in apps"
          :key="app.id"
          class="leading-none card h-40 w-40 relative mr-7 mb-7"
        >
          <a :href="app.url" class="tile-layer p-5" :class="app.colors">
            <div class="text-6xl font-extrabold mb-1 mt-2" aria-hidden="true">
              {{ app.label.substring(0, 2) }}
            </div>
            <span class="leading-tight mt-2">{{ app.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.tile-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, 10rem);
  grid-auto-rows: 10rem;
  grid-gap: 1.5rem;
}

.tile-layer {
  z-index: -1;
  position: absolute;
  @apply inset-0;
  @apply text-center;
  transform: translate(0rem, 0rem);
}
#apps li.card:hover {
  height: 9.5em;
  width: 9.5em;
  margin-left: 0.25em;
  margin-top: 0.25em;
  transition: all 0.1s ease;
}
</style>
