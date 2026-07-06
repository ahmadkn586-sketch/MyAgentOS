'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { Check, ArrowRight, Phone, Calendar, TrendingUp, Users } from 'lucide-react'

export default function DashboardPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [checklist, setChecklist] = useState({
    aiBrain: false,
    vapiKey: false,
    numberForwarded: false,
    testCall: false,
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Demo data
        setProfile({ business_name: 'City Medical Practice', plan: 'growth' })
        setCalls([
          { id: 'd1', startedAt: new Date(Date.now() - 1000*60*45).toISOString(), customer: { number: '+44 20 7946 0958' }, analysis: { summary: 'Appointment booked for Tuesday.' } },
          { id: 'd2', startedAt: new Date(Date.now() - 1000*60*120).toISOString(), customer: { number: '+44 7700 900123' }, analysis: { summary: 'Spam call blocked.' } },
        ])
        setChecklist({ aiBrain: true, vapiKey: true, numberForwarded: false, testCall: true })
        setLoading(false)
        return
      }

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

      const hasVapi = !!profileData?.vapi_api_key
      const hasNumber = !!profileData?.vapi_phone_number

      setChecklist({
        aiBrain: !!brainData?.practice_name,
        vapiKey: hasVapi,
        numberForwarded: hasNumber,
        testCall: hasVapi && hasNumber,
      })

      // Try to fetch calls
      if (hasVapi) {
        try {
          const res = await fetch('https://api.vapi.ai/call', {
            headers: { Authorization: `Bearer ${profileData.vapi_api_key}` },
          })
          if (res.ok) {
            const data = await res.json()
            setCalls(Array.isArray(data) ? data.slice(0, 6) : [])
          }
        } catch {}
      }

      setLoading(false)
    }
    load()
  }, [])

  const completedCount = Object.values(checklist).filter(Boolean).length
  const allDone = completedCount === 4

  const stats = [
    { label: 'Calls Today', value: calls.length || '12', sub: profile?.vapi_api_key ? 'Live' : 'Demo' },
    { label: 'Resolution Rate', value: '89%', sub: 'Last 7 days' },
    { label: 'Avg Handle Time', value: '2m 14s', sub: 'Improving' },
    { label: 'Active AI Staff', value: profile?.plan === 'scale' ? '8' : profile?.plan === 'growth' ? '3' : '1', sub: `${profile?.plan || 'starter'} plan` },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-sm text-gray-500">Welcome back</div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {profile?.business_name || 'Dashboard'}
          </h1>
        </div>
        <Link href="/calls" className="btn btn-primary flex items-center gap-2">
          View All Calls <ArrowRight size={16} />
        </Link>
      </div>

      {/* Onboarding Checklist */}
      {!allDone && (
        <div className="mb-10 bg-white border border-bordergray rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Get your AI employee fully set up</h2>
              <p className="text-gray-500 text-sm mt-0.5">{completedCount} of 4 steps complete</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-electric">{completedCount}/4</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'aiBrain', label: 'Complete your AI Brain', href: '/ai-brain', desc: 'Train your AI on your practice' },
              { key: 'vapiKey', label: 'Connect Vapi API key', href: '/settings', desc: 'Enable live call handling' },
              { key: 'numberForwarded', label: 'Forward your phone number', href: '/settings', desc: 'Route calls to your AI' },
              { key: 'testCall', label: 'Make your first test call', href: '/calls', desc: 'See it in action' },
            ].map((item) => {
              const done = checklist[item.key as keyof typeof checklist]
              return (
                <Link href={item.href} key={item.key} className="flex items-start gap-4 p-4 border border-bordergray rounded-2xl hover:bg-gray-50 transition group">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-success text-white' : 'border-2 border-gray-300'}`}>
                    {done ? <Check size={15} /> : null}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${done ? 'line-through text-gray-400' : ''}`}>{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-electric mt-1" size={16} />
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="text-4xl font-extrabold mt-1 tracking-tighter">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Calls */}
        <div className="lg:col-span-3 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="font-semibold">Recent Calls</div>
            <Link href="/calls" className="text-sm text-electric font-medium flex items-center gap-1">See all <ArrowRight size={14} /></Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
            </div>
          ) : calls.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No calls yet. <Link href="/calls" className="text-electric">Simulate a call</Link>
            </div>
          ) : (
            <div className="space-y-1">
              {calls.slice(0, 4).map((call: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl -mx-2 transition">
                  <div>
                    <div className="font-medium text-sm">{call.customer?.number || 'Unknown caller'}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(call.startedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-600 truncate max-w-[220px]">
                      {call.analysis?.summary?.slice(0, 55) || 'Call handled'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 card p-6">
          <div className="font-semibold mb-5">Quick Actions</div>
          <div className="space-y-3">
            <Link href="/ai-brain" className="flex items-center justify-between p-4 border border-bordergray hover:border-gray-300 rounded-2xl group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-electriclight rounded-2xl flex items-center justify-center">
                  <Users className="text-electric" size={20} />
                </div>
                <div>
                  <div className="font-medium">Update AI Brain</div>
                  <div className="text-xs text-gray-500">Train your receptionist</div>
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-electric" />
            </Link>

            <Link href="/settings" className="flex items-center justify-between p-4 border border-bordergray hover:border-gray-300 rounded-2xl group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-electriclight rounded-2xl flex items-center justify-center">
                  <Phone className="text-electric" size={20} />
                </div>
                <div>
                  <div className="font-medium">Connect Vapi</div>
                  <div className="text-xs text-gray-500">Live call handling</div>
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-electric" />
            </Link>

            <Link href="/calls" className="flex items-center justify-between p-4 border border-bordergray hover:border-gray-300 rounded-2xl group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-electriclight rounded-2xl flex items-center justify-center">
                  <Phone className="text-electric" size={20} />
                </div>
                <div>
                  <div className="font-medium">Simulate a Call</div>
                  <div className="text-xs text-gray-500">Test your AI instantly</div>
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-electric" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="mt-8 bg-gradient-to-r from-electriclight to-white border border-bordergray rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-lg">Your AI employee is handling calls 24/7</div>
          <div className="text-gray-600 text-sm">Next billing date: 4th August • {profile?.plan?.toUpperCase() || 'GROWTH'} plan</div>
        </div>
        <Link href="/billing" className="btn btn-secondary">Manage Billing</Link>
      </div>
    </div>
  )
}
