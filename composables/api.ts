import type { FetchError } from 'ofetch'

const apiEndpoint =
  'https://' +
  (process.dev
    ? useRuntimeConfig().public.apiIp || window.location.hostname
    : window.location.hostname) +
  '/yunohost/portalapi'

export function useApi<T>(
  path: string,
  {
    method = 'GET',
    body = undefined,
  }: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: Record<string, any>
  } = {},
) {
  type Resp = {
    data: Ref<T | null>
    error: Ref<FetchError | null>
  }
  const result: Resp = {
    data: ref(null),
    error: ref(null),
  }

  const query = () => {
    return $fetch(apiEndpoint + path, {
      method,
      credentials: 'include',
      body,
    })
      .then((data) => {
        result.data.value = data as T
      })
      .catch((e: FetchError) => {
        result.error.value = e
        if (e.statusCode === 401) {
          useIsLoggedIn().value = false
          navigateTo('/login')
        } else if (e.statusCode !== 400 && !e.data?.path) {
          throw createError({
            statusCode: e.statusCode,
            statusMessage: e.message,
            fatal: true,
          })
        }
      })
  }
  return Promise.resolve(query()).then(() => result)
}

export interface UserData {
  username: string
  fullname: string
  mail: string
  mailalias: string[]
  mailforward: string[]
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

  const update = (data: Partial<UserData>) => {
    Object.assign(userData.value as UserData, data)
  }

  return {
    userData: userData as Ref<UserData>,
    update,
  }
}
