const VITE_DEAUTH_API_URL = import.meta.env.VITE_DEAUTH_API_URL

interface SignInWithGoogleProps {
  selectAccount?: boolean
}

export async function signInWithGoogle({
  selectAccount = false,
}: SignInWithGoogleProps = {}) {
  const url = new URL(`${VITE_DEAUTH_API_URL}/auth/google`)

  url.searchParams.set('app', 'panel')

  if (selectAccount) url.searchParams.set('prompt', 'select_account')

  window.location.href = url.toString()
}
