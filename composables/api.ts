import type { AsyncData } from 'nuxt/app'
import type { FetchError } from 'ofetch'

export async function useApi<T>(
  path: string,
  {
    method = 'GET',
    body = undefined,
  }: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: Record<string, any>
  } = {},
): Promise<AsyncData<T, FetchError | null>> {
  const host = window.location.hostname
  const apiEndpoint =
    'https://' +
    (process.dev ? useRuntimeConfig().public.apiIp || host : host) +
    '/yunohost/portalapi'

  const result = await useFetch(apiEndpoint + path, {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': '',
    },
    method,
    credentials: 'include',
    body,
  })

  const error = result.error.value
  if (error && error.statusCode === 401) {
    useIsLoggedIn().value = false
    navigateTo('/login')
  }

  return result as AsyncData<T, FetchError | null>
}
