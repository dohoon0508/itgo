const INTERACTIONS_KEY = 'itgo_mentor_interactions'

function parseList(raw) {
  try {
    return JSON.parse(raw || '[]')
  } catch {
    return []
  }
}

export function getMentorInteractions() {
  if (typeof window === 'undefined') return []
  return parseList(window.localStorage.getItem(INTERACTIONS_KEY))
}

export function addMentorInteraction(payload) {
  if (typeof window === 'undefined') return null
  const next = {
    id: `mi-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
    ...payload,
  }
  const updated = [next, ...getMentorInteractions()]
  window.localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(updated))
  return next
}

export function markInteractionRead(interactionId) {
  if (typeof window === 'undefined') return
  const updated = getMentorInteractions().map((item) =>
    item.id === interactionId ? { ...item, read: true } : item
  )
  window.localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(updated))
}

export function deleteMentorInteraction(interactionId) {
  if (typeof window === 'undefined') return
  const updated = getMentorInteractions().filter((item) => item.id !== interactionId)
  window.localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(updated))
}
