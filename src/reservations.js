// Reservation CRUD operations using localStorage

const STORAGE_KEY = 'restaurant_reservations'

// Generate unique reservation ID
const generateId = () => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `RES-${timestamp}-${random}`.toUpperCase()
}

// Get all reservations
export const getReservations = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    } catch {
        return []
    }
}

// Add a new reservation
export const addReservation = (reservation) => {
    const reservations = getReservations()
    const newReservation = {
        id: generateId(),
        ...reservation,
        status: 'pending',
        createdAt: new Date().toISOString()
    }
    reservations.push(newReservation)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
    return newReservation
}

// Update reservation status
export const updateReservationStatus = (id, status) => {
    const reservations = getReservations()
    const index = reservations.findIndex(r => r.id === id)
    if (index !== -1) {
        reservations[index].status = status
        reservations[index].updatedAt = new Date().toISOString()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
        return reservations[index]
    }
    return null
}

// Delete a reservation
export const deleteReservation = (id) => {
    const reservations = getReservations()
    const filtered = reservations.filter(r => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return filtered
}

// Get reservations by date
export const getReservationsByDate = (date) => {
    const reservations = getReservations()
    return reservations.filter(r => r.date === date)
}

// Get available time slots for a date
export const getAvailableTimeSlots = (date) => {
    const allSlots = [
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
    ]

    const reservationsOnDate = getReservationsByDate(date)
    const bookedTimes = reservationsOnDate
        .filter(r => r.status !== 'cancelled')
        .map(r => r.time)

    // Allow max 2 reservations per time slot (12 seats / ~6 per party average)
    const slotCounts = {}
    bookedTimes.forEach(time => {
        slotCounts[time] = (slotCounts[time] || 0) + 1
    })

    return allSlots.map(slot => ({
        time: slot,
        available: (slotCounts[slot] || 0) < 2
    }))
}

// Format date for display
export const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
}

// Get min date (today) and max date (3 months ahead)
export const getDateBounds = () => {
    const today = new Date()
    const maxDate = new Date()
    maxDate.setMonth(maxDate.getMonth() + 3)

    return {
        min: today.toISOString().split('T')[0],
        max: maxDate.toISOString().split('T')[0]
    }
}
