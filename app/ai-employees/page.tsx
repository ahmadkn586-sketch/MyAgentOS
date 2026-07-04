'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'

const planLimits: Record<string, number> = { starter: 1, growth: 3, scale: 8 }
const defaultNames = ['Aria', 'James', 'Sophie', 'Oliver', 'Emma', 'Noah', 'Mia', 'Leo']

export default function AIEmployeesPage() {
  const supabase = createClient()
  const [plan, setPlan] = useState('starter')
  const [employees, setEmployees] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
      setPlan(profile?.plan || 'starter')

      const { data: emps } = await supabase.from('ai_employees').select('*').eq('user_id', user.id)
      setEmployees(emps || [])
    }
    load()
  }, [])

  const limit = planLimits[plan] || 1
  const slots = Array.from({ length: limit }, (_, i) => employees[i] || { name: defaultNames[i], status: 'inactive', calls_handled: 0 })

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-extrabold mb-1">AI Employees</h1>
        <p className="text-gray-500 mb-8">Your AI team handling calls on behalf of your practice.</p>

        <div className="border border-bordergray rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-500 mb-2">Employees active on your plan</p>
          <p className="text-2xl font-extrabold capitalize">{employees.length} of {limit} — {plan} plan</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {slots.map((emp, i) => (
            <div key={i} className="border border-bordergray rounded-2xl p-5">
              <div className="w-12 h-12 bg-electric text-white rounded-full flex items-center justify-center font-bold mb-3">
                {emp.name?.[0]}
              </div>
              <p className="font-bold mb-1">{emp.name}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${emp.status === 'active' ? 'bg-green-50 text-success' : 'bg-gray-100 text-gray-500'}`}>
                {emp.status === 'active' ? 'Active' : 'Not Configured'}
              </span>
              <div className="mt-3 text-sm text-gray-500">
                <p>Calls Handled: {emp.calls_handled || 0}</p>
              </div>
              <button className="mt-4 w-full border border-bordergray py-2 rounded-lg text-sm font-semibold">Configure</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
