const RESERVATIONS_KEY = 'itgo_reservations'

function parseReservations(raw) {
  try {
    return JSON.parse(raw || '[]')
  } catch {
    return []
  }
}

export function getReservations() {
  if (typeof window === 'undefined') return []
  return parseReservations(window.localStorage.getItem(RESERVATIONS_KEY))
}

export function addReservation(payload) {
  if (typeof window === 'undefined') return null
  const list = getReservations()
  const next = {
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'requested',
    ...payload,
  }
  const updated = [next, ...list]
  window.localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated))
  return next
}

export function cancelReservation(reservationId) {
  if (typeof window === 'undefined') return
  const updated = getReservations().filter((item) => item.id !== reservationId)
  window.localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated))
}
