export const useApiEndpoint = () => "https://" + window.location.hostname + '/yunohost/portalapi'
export const useIsLoggedIn = () => useState<boolean>('isLoggedIn', () => false)
