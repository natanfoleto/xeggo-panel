const VITE_DEAUTH_API_URL = import.meta.env.VITE_DEAUTH_API_URL

export async function signInWithGoogle() {
  window.location.href = `${VITE_DEAUTH_API_URL}/auth/google`
}
