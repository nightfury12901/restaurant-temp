import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addReservation, getAvailableTimeSlots, getDateBounds, formatDate } from '../utils/reservations'

const ReservationModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1) // 1: form, 2: confirmation
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        partySize: 2,
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
    })
    const [timeSlots, setTimeSlots] = useState([])
    const [errors, setErrors] = useState({})
    const [confirmation, setConfirmation] = useState(null)
    const dateBounds = getDateBounds()

    // Update time slots when date changes
    useEffect(() => {
        if (formData.date) {
            setTimeSlots(getAvailableTimeSlots(formData.date))
            setFormData(prev => ({ ...prev, time: '' }))
        }
    }, [formData.date])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.date) newErrors.date = 'Please select a date'
        if (!formData.time) newErrors.time = 'Please select a time'
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            const reservation = addReservation(formData)
            setConfirmation(reservation)
            setStep(2)
        }
    }

    const handleClose = () => {
        setStep(1)
        setFormData({
            date: '',
            time: '',
            partySize: 2,
            name: '',
            email: '',
            phone: '',
            specialRequests: ''
        })
        setErrors({})
        setConfirmation(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                onClick={handleClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-xl bg-gradient-to-b from-[#1a3a28] to-[#0d1a12] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    {step === 1 ? (
                        /* Reservation Form */
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="text-center mb-8">
                                <span className="text-xs tracking-[0.4em] text-luxuryGold-400 uppercase">Reserve Your Table</span>
                                <h2 className="text-3xl font-light text-white mt-2">Make a Reservation</h2>
                            </div>

                            <div className="space-y-5">
                                {/* Date & Time Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Date *</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            min={dateBounds.min}
                                            max={dateBounds.max}
                                            className={`w-full px-4 py-3 bg-white/5 border ${errors.date ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-luxuryGold-400 transition-colors`}
                                        />
                                        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Time *</label>
                                        <select
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            disabled={!formData.date}
                                            className={`w-full px-4 py-3 bg-white/5 border ${errors.time ? 'border-red-500' : 'border-white/10'} rounded-xl text-white focus:outline-none focus:border-luxuryGold-400 transition-colors disabled:opacity-50`}
                                        >
                                            <option value="">Select time</option>
                                            {timeSlots.map(slot => (
                                                <option
                                                    key={slot.time}
                                                    value={slot.time}
                                                    disabled={!slot.available}
                                                >
                                                    {slot.time} {!slot.available && '(Full)'}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                                    </div>
                                </div>

                                {/* Party Size */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Party Size</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, partySize: num }))}
                                                className={`flex-1 py-3 rounded-xl border transition-all duration-300 ${formData.partySize === num
                                                        ? 'bg-luxuryGold-400 text-[#0d1a12] border-luxuryGold-400 font-medium'
                                                        : 'bg-white/5 border-white/10 text-white hover:border-luxuryGold-400/50'
                                                    }`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name & Email Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Smith"
                                            className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-luxuryGold-400 transition-colors`}
                                        />
                                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-luxuryGold-400 transition-colors`}
                                        />
                                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 123-4567"
                                        className={`w-full px-4 py-3 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-luxuryGold-400 transition-colors`}
                                    />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                {/* Special Requests */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Special Requests</label>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleChange}
                                        placeholder="Allergies, celebrations, seating preferences..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-luxuryGold-400 transition-colors resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-luxuryGold-400 text-[#0d1a12] font-medium tracking-[0.15em] rounded-xl hover:bg-luxuryGold-300 transition-colors"
                                >
                                    CONFIRM RESERVATION
                                </motion.button>
                            </div>
                        </form>
                    ) : (
                        /* Confirmation View */
                        <div className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                                className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxuryGold-400/20 flex items-center justify-center"
                            >
                                <svg className="w-10 h-10 text-luxuryGold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>

                            <h2 className="text-3xl font-light text-white mb-2">Reservation Confirmed!</h2>
                            <p className="text-gray-400 mb-8">A confirmation has been sent to your email</p>

                            {confirmation && (
                                <div className="bg-white/5 rounded-2xl p-6 text-left mb-8 border border-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs tracking-[0.3em] text-luxuryGold-400">BOOKING REFERENCE</span>
                                        <span className="text-lg font-mono text-white">{confirmation.id}</span>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Date</span>
                                            <span className="text-white">{formatDate(confirmation.date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Time</span>
                                            <span className="text-white">{confirmation.time}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Party Size</span>
                                            <span className="text-white">{confirmation.partySize} {confirmation.partySize === 1 ? 'guest' : 'guests'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Name</span>
                                            <span className="text-white">{confirmation.name}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <motion.button
                                onClick={handleClose}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 border border-luxuryGold-400 text-luxuryGold-400 font-medium tracking-[0.15em] rounded-xl hover:bg-luxuryGold-400 hover:text-[#0d1a12] transition-colors"
                            >
                                DONE
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ReservationModal
