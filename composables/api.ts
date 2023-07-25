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

export interface UserData {
  username: string
  fullname: string
  mail: string
  'mail-aliases': string[]
  'mail-forward': string[]
  groups: string[]
  apps: Record<string, { label: string; url: string }>
}

export const useUserData = () => useState<UserData | undefined>('userData')

export async function useUserInfo() {
  const userData = useUserData()

  if (!userData.value) {
    const { data } = await useApi('/me')
    userData.value = data.value as UserData
  }
  return userData as Ref<UserData>
}
