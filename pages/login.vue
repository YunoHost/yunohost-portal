<script setup lang="ts">
const isLoggedIn = useIsLoggedIn()

const form = {
  username: '',
  password: '',
}

async function login() {
  const { error } = await useApi('/login', {
    method: 'POST',
    body: { credentials: form.username + ':' + form.password },
  })

  if (!error.value) {
    isLoggedIn.value = true
    await navigateTo('/')
  } else {
    // FIXME : display an error or something
  }
}
</script>

<template>
  <div class="w-80 mx-auto pt-20">
    <img class="flex-none mx-auto w-1/2 p-5" src="/assets/img/logo-white.svg" />
    <form method="POST" @submit.prevent="login">
      <div class="flex items-center mb-6">
        <div class="w-1/6">
          <label class="pl-3" for="login-username">
            <Icon name="mdi:account-circle" size="2em" class="text-gray-400" />
          </label>
        </div>
        <div class="">
          <input
            id="login-username"
            v-model="form.username"
            class="text-gray-700 rounded py-2 px-4"
            type="text"
            placeholder="username"
          />
        </div>
      </div>
      <div class="flex items-center mb-6">
        <div class="w-1/6">
          <label class="pl-3" for="login-password">
            <Icon name="mdi:lock" size="2em" class="text-gray-400" />
          </label>
        </div>
        <div class="">
          <input
            id="login-password"
            v-model="form.password"
            class="text-gray-700 rounded py-2 px-4"
            type="password"
            placeholder="******************"
          />
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-full">
          <button
            class="w-full bg-indigo-500 hover:bg-indigo-400 font-bold py-2 px-4 rounded"
            type="submit"
          >
            Connect
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
