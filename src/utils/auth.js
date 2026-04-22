const AUTH_KEY = 'itgo_auth'
const AUTH_EVENT = 'itgo-auth-changed'

function safeParse(json) {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function getAuthUser() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(AUTH_KEY)
  const parsed = raw ? safeParse(raw) : null
  if (!parsed?.role) return null
  return parsed
}

export function loginAsRole(role) {
  if (typeof window === 'undefined') return
  const user = {
    role,
    name: role === 'mentor' ? '멘토 사용자' : '멘티 사용자',
  }
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function logout() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_KEY)
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function onAuthChange(handler) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(AUTH_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(AUTH_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}
