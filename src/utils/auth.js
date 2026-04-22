const AUTH_KEY = 'itgo_auth'
const AUTH_EVENT = 'itgo-auth-changed'
const ROLE_KEY = 'userRole'
const MENTEE_ID_KEY = 'currentMenteeId'

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
  const currentMenteeId = window.localStorage.getItem(MENTEE_ID_KEY) || parsed.currentMenteeId || null
  return { ...parsed, currentMenteeId }
}

export function loginAsRole(role) {
  if (typeof window === 'undefined') return
  const currentMenteeId = role === 'mentee' ? 'mentee-001' : null
  const user = {
    role,
    name: role === 'mentor' ? '멘토 사용자' : '멘티 사용자',
    currentMenteeId,
  }
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  window.localStorage.setItem(ROLE_KEY, role)
  if (currentMenteeId) {
    window.localStorage.setItem(MENTEE_ID_KEY, currentMenteeId)
  } else {
    window.localStorage.removeItem(MENTEE_ID_KEY)
  }
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function logout() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_KEY)
  window.localStorage.removeItem(ROLE_KEY)
  window.localStorage.removeItem(MENTEE_ID_KEY)
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
