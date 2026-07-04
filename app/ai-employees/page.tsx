'use client'

import Sidebar from '@/components/Sidebar'
import { Users, Plus } from 'lucide-react'

export default function AIEmployeesPage() {
  const employees = [
    { id: 1, name: 'Primary Receptionist', plan: 'Growth', status: 'Active', calls: 1240 },
    { id: 2, name: 'Backup Receptionist', plan: 'Growth', status: 'Active', calls: 382 },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">AI Employees</h1>
            <p className="text-gray-500">Manage your team of AI receptionists</p>
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={18} /> Add AI Employee
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map((emp) => (
            <div key={emp.id} className="card p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xl">{emp.name}</div>
                  <div className="text-sm text-gray-500">{emp.plan} plan</div>
                </div>
                <div className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Active</div>
              </div>

              <div className="my-8">
                <div className="text-5xl font-extrabold tracking-tighter">{emp.calls}</div>
                <div className="text-sm text-gray-500">calls handled this month</div>
              </div>

              <div className="flex gap-3">
                <button className="btn btn-secondary flex-1">Edit AI Brain</button>
                <button className="btn btn-secondary flex-1">View Analytics</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-electriclight rounded-3xl text-sm text-electric">
          Your current plan allows up to 3 AI employees. Upgrade to Scale for 8.
        </div>
      </main>
    </div>
  )
}
