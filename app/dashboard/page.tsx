'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      } else {
        setProfile({ business_name: 'Demo Practice', plan: 'growth' })
      }
    }
    load()
  }, [])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome back{profile?.business_name ? `, ${profile.business_name}` : ''}.</p>
        </div>
        <Link href="/calls" className="btn btn-primary">View All Calls</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <div className="text-sm text-gray-500">Calls Today</div>
          <div className="text-3xl font-bold">12</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-500">Resolution Rate</div>
          <div className="text-3xl font-bold">89%</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-500">AI Employees</div>
          <div className="text-3xl font-bold">{profile?.plan === 'scale' ? '8' : '3'}</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/ai-brain" className="btn btn-secondary">Update AI Brain</Link>
        <Link href="/settings" className="btn btn-secondary">Connect Vapi</Link>
      </div>
    </div>
  )
}
