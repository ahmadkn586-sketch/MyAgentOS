'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'
import { Plus, X } from 'lucide-react'

export default function AppointmentsPage() {
  const supabase = createClient()
  const [appointments, setAppointments] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [userId, setUserId] = useState('')
  const [form, setForm] = useState({ client_name: '', contact_number: '', appointment_date: '', appointment_time: '', reason: '' })

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)
    const { data } = await supabase.from('appointments').select('*').eq('user_id', user.id).order('appointment_date', { ascending: true })
    setAppointments(data || [])
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    await supabase.from('appointments').insert({ ...form, user_id: userId, status: 'pending', booked_by: 'Manual Entry' })
    setShowModal(false)
    setForm({ client_name: '', contact_number: '', appointment_date: '', appointment_time: '', reason: '' })
    load()
  }

  const statusColor = (s: string) => s === 'confirmed' ? 'bg-green-50 text-success' : s === 'cancelled' ? 'bg-red-50 text-danger' : 'bg-yellow-50 text-yellow-700'

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Appointments</h1>
            <p className="text-gray-500">All appointments booked by your AI employees.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-electric text-white px-5 py-2.5 rounded-lg text-sm font-semibold">
            <Plus size={16} /> Add Appointment
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'confirmed', 'pending', 'cancelled'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-electriclight text-electric' : 'bg-gray-50 text-gray-600'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="border border-bordergray rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Client Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Booked By</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No appointments yet.</td></tr>
              )}
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-bordergray">
                  <td className="px-4 py-3 font-medium">{a.client_name}</td>
                  <td className="px-4 py-3">{a.contact_number}</td>
                  <td className="px-4 py-3">{a.appointment_date}</td>
                  <td className="px-4 py-3">{a.appointment_time}</td>
                  <td className="px-4 py-3 text-gray-500">{a.reason}</td>
                  <td className="px-4 py-3 text-gray-500">{a.booked_by}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(a.status)}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Add Appointment</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Client Name" className="w-full border border-bordergray rounded-lg px-3 py-2.5 text-sm" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
              <input placeholder="Contact Number" className="w-full border border-bordergray rounded-lg px-3 py-2.5 text-sm" value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} />
              <input type="date" className="w-full border border-bordergray rounded-lg px-3 py-2.5 text-sm" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} />
              <input type="time" className="w-full border border-bordergray rounded-lg px-3 py-2.5 text-sm" value={form.appointment_time} onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} />
              <input placeholder="Reason" className="w-full border border-bordergray rounded-lg px-3 py-2.5 text-sm" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <button onClick={handleAdd} className="w-full bg-electric text-white py-3 rounded-lg font-semibold mt-4">Save</button>
          </div>
        </div>
      )}
    </div>
  )
}
