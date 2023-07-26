export const useIsLoggedIn = () => useState<boolean>('isLoggedIn', () => false)
export const useRedirectUrl = () =>
  useState<string | null>('redirectUrl', () => null)
