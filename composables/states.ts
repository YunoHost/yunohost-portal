// AUTH

export const useIsLoggedIn = () => {
  const isLoggedIn = useState<boolean>(
    'isLoggedIn',
    () => localStorage.getItem('isLoggedIn') === 'true',
  )

  return computed({
    get: () => isLoggedIn.value,
    set: (value) => {
      isLoggedIn.value = value
      localStorage.setItem('isLoggedIn', value.toString())
    },
  })
}

// LOCALE

const usePreferedLocaleState = () =>
  useState<string>(
    'preferedLocale',
    () => localStorage.getItem('preferedLocale') || 'auto',
  )

export const usePreferedLocale = () => {
  const preferedLocale = usePreferedLocaleState()
  const { locale, getBrowserLocale, defaultLocale } = useNuxtApp().$i18n

  return computed({
    get: () => preferedLocale.value,
    set: (value) => {
      preferedLocale.value = value
      localStorage.setItem('preferedLocale', value)

      if (value === 'auto') {
        const browserLocale = getBrowserLocale()
        value = browserLocale || defaultLocale
      }

      locale.value = value
    },
  })
}

// THEME

const usePreferedThemeState = () =>
  useState<string>(
    'preferedTheme',
    () => localStorage.getItem('preferedTheme') || 'auto',
  )

export const usePreferedTheme = async () => {
  const preferedTheme = usePreferedThemeState()
  const colorMode = useColorMode()
  const settings = await useSettings()

  return computed({
    get: () => preferedTheme.value,
    set: (value) => {
      preferedTheme.value = value
      localStorage.setItem('preferedTheme', value)

      if (value === 'auto') {
        value = settings.value.portal_theme
      }

      colorMode.preference = value
    },
  })
}

export const useRedirectUrl = () =>
  useState<string | null>('redirectUrl', () => null)

export const useQueryMsg = () => useState<string | null>('queryMsg', () => null)

// SETTINGS

export interface Settings {
  domain: string
  public: boolean
  portal_logo: string
  portal_theme: string
  portal_title: string
  show_other_domains_apps: 0 | 1
  portal_user_intro: string
  portal_public_intro: string
  apps: Record<string, { label: string; url: string }>
}

const useSettingsState = () => useState<Settings>('settings')

export const useSettings = async () => {
  const settings = useSettingsState()

  if (!settings.value) {
    const { data } = await useApi<Settings>('/public')
    settings.value = data.value as Settings

    const colorMode = useColorMode()
    colorMode.preference = settings.value.portal_theme
  }

  return settings
}

// USER

export interface User {
  username: string
  fullname: string
  mail: string
  mailalias: string[]
  mailforward: string[]
  groups: string[]
  apps: Record<string, { label: string; url: string }>
}

export const useUserState = () => useState<User | null>('user', () => null)

export const useUser = async <T extends User | null = User>() => {
  const user = useUserState()
  const isLoggedIn = useIsLoggedIn()

  if (!user.value && isLoggedIn.value) {
    const { data } = await useApi<T>('/me')
    user.value = data.value
  }

  return user as Ref<T>
}

// APP

export const useApps = async () => {
  const isLoggedIn = useIsLoggedIn()
  const settings = await useSettings()
  const user = await useUser()

  return computed(() => {
    return isLoggedIn.value ? user.value?.apps : settings.value.apps
  })
}
