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

export const useRedirectUrl = () =>
  useState<string | null>('redirectUrl', () => null)
