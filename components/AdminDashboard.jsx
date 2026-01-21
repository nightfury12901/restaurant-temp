import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    getReservations,
    updateReservationStatus,
    deleteReservation,
    formatDate,
    getTodayDate
} from '../utils/reservations'

const AdminDashboard = () => {
    const [reservations, setReservations] = useState([])
    const [filter, setFilter] = useState('all') // all, pending, confirmed, cancelled
    const [dateFilter, setDateFilter] = useState('')
    const [selectedReservation, setSelectedReservation] = useState(null)

    useEffect(() => {
        loadReservations()
    }, [])

    const loadReservations = () => {
        setReservations(getReservations())
    }

    const handleStatusChange = (id, status) => {
        updateReservationStatus(id, status)
        loadReservations()
        setSelectedReservation(null)
    }

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this reservation?')) {
            deleteReservation(id)
            loadReservations()
            setSelectedReservation(null)
        }
    }

    const filteredReservations = reservations
        .filter(r => filter === 'all' || r.status === filter)
        .filter(r => !dateFilter || r.date === dateFilter)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const stats = {
        total: reservations.length,
        pending: reservations.filter(r => r.status === 'pending').length,
        confirmed: reservations.filter(r => r.status === 'confirmed').length,
        today: reservations.filter(r => r.date === getTodayDate()).length
    }

    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1f14] to-[#050a07] text-white p-6 md:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-light tracking-wide">
                        <span className="text-luxuryGold-400">Reservation</span> Dashboard
                    </h1>
                    <p className="text-gray-400 mt-1">Manage your restaurant bookings</p>
                </div>
                <a
                    href="/"
                    className="px-6 py-2 border border-white/20 rounded-lg text-sm hover:bg-white/5 transition-colors"
                >
                    ← Back to Website
                </a>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total', value: stats.total, color: 'from-white/10' },
                    { label: 'Pending', value: stats.pending, color: 'from-yellow-500/20' },
                    { label: 'Confirmed', value: stats.confirmed, color: 'from-green-500/20' },
                    { label: 'Today', value: stats.today, color: 'from-luxuryGold-400/20' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} to-transparent border border-white/10`}
                    >
                        <div className="text-3xl font-light text-luxuryGold-400">{stat.value}</div>
                        <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex gap-2">
                    {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${filter === status
                                    ? 'bg-luxuryGold-400 text-[#0d1a12]'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <input
                    type="date"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-luxuryGold-400"
                />

                {dateFilter && (
                    <button
                        onClick={() => setDateFilter('')}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Clear date
                    </button>
                )}
            </div>

            {/* Reservations Table */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                {filteredReservations.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-lg mb-2">No reservations found</p>
                        <p className="text-sm">Reservations will appear here when customers book</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-white/10">
                                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="p-4">Reference</th>
                                    <th className="p-4">Guest</th>
                                    <th className="p-4">Date & Time</th>
                                    <th className="p-4">Party</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredReservations.map((res, i) => (
                                        <motion.tr
                                            key={res.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                            onClick={() => setSelectedReservation(res)}
                                        >
                                            <td className="p-4 font-mono text-sm text-luxuryGold-400">{res.id}</td>
                                            <td className="p-4">
                                                <div className="font-medium">{res.name}</div>
                                                <div className="text-sm text-gray-400">{res.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div>{new Date(res.date).toLocaleDateString()}</div>
                                                <div className="text-sm text-gray-400">{res.time}</div>
                                            </td>
                                            <td className="p-4">{res.partySize}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs border capitalize ${statusColors[res.status]}`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {res.status === 'pending' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(res.id, 'confirmed') }}
                                                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                    {res.status !== 'cancelled' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(res.id, 'cancelled') }}
                                                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reservation Detail Modal */}
            <AnimatePresence>
                {selectedReservation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                        onClick={() => setSelectedReservation(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gradient-to-b from-[#1a3a28] to-[#0d1a12] rounded-2xl border border-white/10 p-6 max-w-md w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-xs border capitalize ${statusColors[selectedReservation.status]}`}>
                                        {selectedReservation.status}
                                    </span>
                                    <h3 className="text-xl font-light mt-3">{selectedReservation.name}</h3>
                                </div>
                                <button onClick={() => setSelectedReservation(null)} className="text-gray-400 hover:text-white">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-gray-400">Reference</span>
                                    <span className="font-mono text-luxuryGold-400">{selectedReservation.id}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-gray-400">Date</span>
                                    <span>{formatDate(selectedReservation.date)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-gray-400">Time</span>
                                    <span>{selectedReservation.time}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-gray-400">Party Size</span>
                                    <span>{selectedReservation.partySize} guests</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-gray-400">Email</span>
                                    <span>{selectedReservation.email}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/5">
                                    <span className="text-gray-400">Phone</span>
                                    <span>{selectedReservation.phone}</span>
                                </div>
                                {selectedReservation.specialRequests && (
                                    <div className="py-2">
                                        <span className="text-gray-400 block mb-2">Special Requests</span>
                                        <p className="bg-white/5 p-3 rounded-lg">{selectedReservation.specialRequests}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                {selectedReservation.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedReservation.id, 'confirmed')}
                                        className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors"
                                    >
                                        Confirm
                                    </button>
                                )}
                                {selectedReservation.status !== 'cancelled' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedReservation.id, 'cancelled')}
                                        className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(selectedReservation.id)}
                                    className="px-4 py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminDashboard
