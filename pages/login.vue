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
                    <input class="text-gray-700 rounded py-2 px-4" id="login-username" type="text" placeholder="username" v-model="form.username">
                </div>
            </div>
            <div class="flex items-center mb-6">
                <div class="w-1/6">
                    <label class="pl-3" for="login-password">
                        <Icon name="mdi:lock" size="2em" class="text-gray-400" />
                    </label>
                </div>
                <div class="">
                    <input class="text-gray-700 rounded py-2 px-4" id="login-password" type="password" placeholder="******************" v-model="form.password">
                </div>
            </div>
            <div class="flex items-center">
                <div class="w-full">
                    <button class="w-full bg-indigo-500 hover:bg-indigo-400 font-bold py-2 px-4 rounded" type="submit">
                        Connect
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<!-- <template #footer></template>  -->

<script setup>
    const apiEndpoint = useApiEndpoint();
    let isLoggedIn = useIsLoggedIn();

    let form = {
        username: "",
        password: ""
    }

    async function login() {

        const { data, error } = await useFetch(apiEndpoint + "/login", {
            headers: { 
                "Content-Type": "application/json", 
                "X-Requested-With": "" 
            },
            method: 'POST',
            credentials: 'include',
            body: { credentials: form.username + ":" + form.password }
       });
  
       if (error.value && error.value.statusCode != 200) {
          // FIXME : display an error or something
       }
       else {
           isLoggedIn = true; // FIXME : not confident this actually mutates the state ...
           await navigateTo('/')
       }
  };
</script>
