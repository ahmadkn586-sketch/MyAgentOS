'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function AppointmentsPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-72 p-8">
        <h1 className="text-4xl font-extrabold mb-2">Appointments</h1>
        <p className="text-gray-500 mb-8">Appointments are booked automatically from calls.</p>

        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-4">No appointments yet. Book one through the Calls page.</p>
          <Link href="/calls" className="btn btn-primary">Go to Calls</Link>
        </div>
      </main>
    </div>
  )
}
