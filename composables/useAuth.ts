import type { User } from '~/types'

export function useAuth() {
  const user = useState<User | null>('auth:user', () => null)
  const loading = ref(false)

  async function fetchSession() {
    try {
      const data = await $fetch('/api/auth/get-session')
      user.value = data?.user || null
    }
    catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      await $fetch('/api/auth/sign-in', {
        method: 'POST',
        body: { email, password },
      })
      await fetchSession()
      await navigateTo('/admin')
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    await $fetch('/api/auth/sign-out', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    fetchSession,
  }
}