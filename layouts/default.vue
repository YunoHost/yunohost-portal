<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
})
</script>

<template>
  <div class="p-10 min-h-screen">
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir"></Html>

    <div class="container mx-auto p-4">
      <slot />
    </div>

    <footer class="container fixed bottom-10 mx-10 pr-10 text-gray-400">
      <slot name="footer">
        <div class="flex flex-row items-end">
          <!-- FIXME: wrap this in an if: connected somehow ? -->
          <nav class="grow space-x-5 border-t mr-10 border-gray-500">
            <a>Edit my profile</a>
            <a href="//yunohost.org/docs" target="_blank">Documentation</a>
            <a href="//yunohost.org/help" target="_blank">Help</a>
            <a href="/yunohost/admin/" target="_blank">Administration</a>
          </nav>
          <img class="flex-none mr-10" src="/assets/img/logo-white.svg" />
        </div>
      </slot>
    </footer>
  </div>
</template>

<style>
body {
  font-family: 'Source Sans 3';
  @apply bg-gray-700 text-gray-200;
}
.btn {
  @apply py-2 px-4 rounded;
}
</style>
