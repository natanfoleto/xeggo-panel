const VITE_PUBLIC_API_URL = import.meta.env.VITE_PUBLIC_API_URL

interface AuthenticateFromGoogleRequest {
  selectAccount?: boolean
}

export async function authenticateFromGoogle({
  selectAccount = false,
}: AuthenticateFromGoogleRequest = {}) {
  const url = new URL(`${VITE_PUBLIC_API_URL}/auth/google`)

  url.searchParams.set('app', 'panel')

  if (selectAccount) url.searchParams.set('prompt', 'select_account')

  window.location.href = url.toString()
}
