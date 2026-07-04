'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function AppointmentsPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-72 p-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight">Appointments</h1>
          <p className="text-gray-500 mt-1 mb-8">Your AI books appointments directly from calls.</p>

          <div className="card p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-electriclight rounded-2xl flex items-center justify-center mb-6">
              📅
            </div>
            <h3 className="font-semibold text-xl mb-2">Appointments are syncing from your AI calls</h3>
            <p className="text-gray-600 max-w-xs mx-auto mb-6">
              When your AI books an appointment during a call, it will appear here automatically.
            </p>
            <Link href="/calls" className="btn btn-primary">
              Go to Calls
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
