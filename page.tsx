'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'
import { Check, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [checklist, setChecklist] = useState({
    aiBrain: false,
    vapiKey: false,
    numberForwarded: false,
    testCall: false,
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      const { data: brainData } = await supabase
        .from('ai_brain')
        .select('practice_name')
        .eq('user_id', user.id)
        .maybeSingle()

      setChecklist({
        aiBrain: !!brainData?.practice_name,
        vapiKey: !!profileData?.vapi_api_key,
        numberForwarded: !!profileData?.vapi_phone_number,
        testCall: false,
      })
    }
    load()
  }, [])

  const completedCount = Object.values(checklist).filter(Boolean).length
  const allDone = completedCount === 4

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-10">
        <p className="text-electric text-sm font-semibold mb-1">{profile?.business_name || '...'}</p>
        <h1 className="text-3xl font-extrabold mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-8">A live look at how your AI employees are performing.</p>

        {!allDone && (
          <div className="border border-bordergray rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Get started with AgentOS</h2>
              <span className="text-sm text-gray-500">{completedCount} of 4 complete</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-electric transition-all" style={{ width: `${(completedCount / 4) * 100}%` }} />
            </div>
            <div className="space-y-3">
              {[
                { key: 'aiBrain', label: 'Complete your AI Brain', href: '/ai-brain' },
                { key: 'vapiKey', label: 'Enter your Vapi API key in Settings', href: '/settings' },
                { key: 'numberForwarded', label: 'Forward your business number to your AgentOS number', href: '/settings' },
                { key: 'testCall', label: 'Make a test call', href: '/calls' },
              ].map((item) => {
                const done = checklist[item.key as keyof typeof checklist]
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${done ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-success text-white' : 'border-2 border-gray-300'}`}>
                      {done && <Check size={14} />}
                    </div>
                    <span className={`flex-1 text-sm font-medium ${done ? 'text-success line-through' : ''}`}>{item.label}</span>
                    {!done && <ArrowRight size={16} className="text-gray-400" />}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Calls Handled Today', value: profile?.vapi_api_key ? '—' : '—', sub: profile?.vapi_api_key ? 'no data yet' : 'connect Vapi to see data' },
            { label: 'Resolution Rate', value: '—', sub: profile?.vapi_api_key ? 'no data yet' : 'connect Vapi to see data' },
            { label: 'Avg Response Time', value: '—', sub: profile?.vapi_api_key ? 'no data yet' : 'connect Vapi to see data' },
            { label: 'Active AI Employees', value: profile?.plan === 'scale' ? '8' : profile?.plan === 'growth' ? '3' : '1', sub: `${profile?.plan || 'starter'} plan` },
          ].map((stat, i) => (
            <div key={i} className="border border-bordergray rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
              <p className="text-3xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.sub}</p>
            </div>
          ))}
        </div>

        {!profile?.vapi_api_key && (
          <div className="bg-electriclight rounded-xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1">Connect your Vapi account to see live call data</h3>
              <p className="text-sm text-gray-600">Your dashboard will populate with real calls, summaries, and analytics once Vapi is connected.</p>
            </div>
            <Link href="/settings" className="bg-electric text-white px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap ml-4">
              Go to Settings
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
