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
  const appTileVariant = [
    'btn-primary',
    'btn-secondary',
    'btn-accent',
    'btn-neutral',
    'btn-info',
    'btn-success',
    'btn-warning',
    'btn-error',
    // FIXME currently using daisyui btn colors to get focus/hover styles,
    // if we want more colors we need to add btn variants based on daisyui colors.
    // 'bg-red-500'
    // 'bg-orange-500'
    // 'bg-yellow-500'
    // 'bg-lime-500'
    // 'bg-green-500'
    // 'bg-teal-500'
    // 'bg-indigo-500'
    // 'bg-primary',
    // 'bg-purple-500'
    // 'bg-rose-500'
  ]

  return Object.entries(appsData.value).map(([id, app]) => {
    return {
      ...app,
      id,
      url: '//' + app.url,
      variant: appTileVariant[parseInt(app.label, 36) % appTileVariant.length],
    }
  })
})
</script>

<template>
  <div>
    <PageTitle :text="$t('app_list')" sr-only />

    <div id="apps" class="my-10">
      <div v-if="!apps.length" class="w-2/3">
        <em>{{ t('no_apps') }}</em>
      </div>

      <ul v-else class="tile-container">
        <li v-for="app in apps" :key="app.id" class="tile relative">
          <a :href="app.url" class="btn" :class="app.variant">
            <span class="text-6xl font-extrabold" aria-hidden="true">
              {{ app.label.substring(0, 2) }}
            </span>
            <span class="leading-tight">{{ app.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.tile-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, 9rem);
  grid-auto-rows: 9rem;
  grid-gap: 1.5rem;
}

.tile a {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.tile:hover a,
.tile a:focus {
  transform: scale(1.05);
}
</style>
