'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { Search, X, Play, RefreshCw } from 'lucide-react'

type Call = {
  id: string
  startedAt: string
  endedAt: string
  customer?: { number?: string }
  analysis?: { summary?: string }
  transcript?: any[]
}

export default function CallsPage() {
  const supabase = createClient()

  const [calls, setCalls] = useState<Call[]>([])
  const [vapiKey, setVapiKey] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Call | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const demoCalls: Call[] = [
    {
      id: 'demo-1',
      startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      endedAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
      customer: { number: '+44 20 7946 0958' },
      analysis: { summary: 'Patient booked appointment for next Tuesday at 2pm.' },
      transcript: [
        { role: 'assistant', message: 'Good afternoon, thank you for calling City Medical. How may I help you today?' },
        { role: 'user', message: 'Hi, I need to book an appointment with Dr. Patel.' },
      ],
    },
    {
      id: 'demo-2',
      startedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      endedAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
      customer: { number: '+44 7700 900123' },
      analysis: { summary: 'Spam call blocked.' },
      transcript: [],
    },
  ]

  const loadCalls = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCalls(demoCalls)
        setLoading(false)
        return
      }
      const { data: profile } = await supabase.from('profiles').select('vapi_api_key').eq('id', user.id).single()
      if (!profile?.vapi_api_key) {
        setCalls(demoCalls)
        setLoading(false)
        return
      }
      setVapiKey(profile.vapi_api_key)
      const res = await fetch('https://api.vapi.ai/call', {
        headers: { Authorization: `Bearer ${profile.vapi_api_key}` },
      })
      const data = await res.json()
      setCalls(Array.isArray(data) && data.length > 0 ? data : demoCalls)
    } catch (e) {
      setCalls(demoCalls)
    }
    setLoading(false)
  }

  useEffect(() => { loadCalls() }, [])

  const filteredCalls = calls.filter((c) => {
    const statusLabel = (c.analysis?.summary || '').toLowerCase().includes('appointment') ? 'Appointment Booked' : 'Handled'
    if (filter !== 'all' && statusLabel !== filter) return false
    if (search && !JSON.stringify(c).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  // ✅ THIS IS THE FIX — safe access
  const selectedTranscript = selected?.transcript || []

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-72 p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Calls</h1>
            <p className="text-gray-500 mt-1">Complete log of every call your AI has handled.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                const newCall: Call = {
                  id: 'sim-' + Date.now(),
                  startedAt: new Date().toISOString(),
                  endedAt: new Date(Date.now() + 240000).toISOString(),
                  customer: { number: '+44 7123 456789' },
                  analysis: { summary: 'Test call' },
                  transcript: [],
                }
                setCalls(prev => [newCall, ...prev])
                setSelected(newCall)
              }} 
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm"
            >
              <Play size={16} /> Simulate Call
            </button>
            <button onClick={loadCalls} className="px-5 py-2.5 border border-bordergray rounded-xl font-semibold text-sm">
              Refresh
            </button>
          </div>
        </div>

        {!vapiKey && !loading && (
          <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-3xl">
            Using demo data. Add your Vapi key in Settings.
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              placeholder="Search calls by caller or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-bordergray rounded-2xl pl-11 py-3"
            />
          </div>
          {['all', 'Handled', 'Appointment Booked'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-2xl text-sm font-medium border transition ${filter === f ? 'bg-electriclight border-electric text-electric' : 'border-bordergray'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Date &amp; Time</th>
                <th>Caller</th>
                <th>Status</th>
                <th>AI Summary</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center">Loading...</td></tr>
              ) : filteredCalls.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No calls match your filters.</td></tr>
              ) : (
                filteredCalls.map((call) => {
                  const statusLabel = (call.analysis?.summary || '').toLowerCase().includes('appointment') ? 'Appointment Booked' : 'Handled'
                  return (
                    <tr key={call.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(call)}>
                      <td className="px-6 py-4">{new Date(call.startedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                      <td className="font-medium">{call.customer?.number || 'Unknown'}</td>
                      <td>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{statusLabel}</span>
                      </td>
                      <td className="text-gray-600 truncate max-w-xs">{call.analysis?.summary || '—'}</td>
                      <td className="px-6">
                        <button className="px-3 py-1 text-xs border border-bordergray rounded-lg">View</button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex z-50" onClick={() => setSelected(null)}>
          <div className="ml-auto w-full max-w-md bg-white h-full overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="font-bold text-xl">{selected.customer?.number}</div>
                <div className="text-sm text-gray-500">{new Date(selected.startedAt).toLocaleString()}</div>
              </div>
              <button onClick={() => setSelected(null)}><X size={22} /></button>
            </div>

            <div className="bg-electriclight rounded-2xl p-4 mb-6">
              <div className="text-xs font-semibold text-electric mb-1">AI SUMMARY</div>
              {selected.analysis?.summary || 'No summary available.'}
            </div>

            <div>
              <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">FULL TRANSCRIPT</div>
              {selectedTranscript.length > 0 ? (
                selectedTranscript.map((msg: any, i: number) => (
                  <div key={i} className="mb-3 text-sm bg-gray-100 p-3 rounded-2xl">
                    <span className="font-medium">{msg.role}: </span>
                    {msg.message || msg.content}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No transcript available for this call.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
