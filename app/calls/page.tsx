'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { Search, X, Play, RefreshCw, Download } from 'lucide-react'

type Call = {
  id: string
  startedAt: string
  endedAt: string
  customer?: { number?: string }
  analysis?: { summary?: string }
  transcript?: any[]
  status?: string
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
  const [debugError, setDebugError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // Demo data (used when no Vapi key is connected)
  const demoCalls: Call[] = [
    {
      id: 'demo-1',
      startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      endedAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
      customer: { number: '+44 20 7946 0958' },
      analysis: { summary: 'Patient booked appointment for next Tuesday at 2pm. Asked about insurance.' },
      transcript: [
        { role: 'assistant', message: 'Good afternoon, thank you for calling City Medical. How may I help you today?' },
        { role: 'user', message: 'Hi, I need to book an appointment with Dr. Patel.' },
        { role: 'assistant', message: 'Of course. What time works for you next week?' },
      ],
    },
    {
      id: 'demo-2',
      startedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      endedAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
      customer: { number: '+44 7700 900123' },
      analysis: { summary: 'Caller was trying to sell extended warranty. Identified as spam.' },
      transcript: [
        { role: 'assistant', message: 'Good afternoon, thank you for calling.' },
        { role: 'user', message: 'Hello, this is about your car warranty...' },
      ],
    },
    {
      id: 'demo-3',
      startedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
      endedAt: new Date(Date.now() - 1000 * 60 * 192).toISOString(),
      customer: { number: '+44 7911 123456' },
      analysis: { summary: 'Emergency — chest pain reported. Forwarded to 999 immediately.' },
      transcript: [
        { role: 'assistant', message: 'I am connecting you to someone urgently, please hold.' },
      ],
    },
  ]

  const loadCalls = async (forceDemo = false) => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCalls(demoCalls)
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('vapi_api_key')
        .eq('id', user.id)
        .single()

      if (!profile?.vapi_api_key || forceDemo) {
        setVapiKey('')
        setCalls(demoCalls)
        setLoading(false)
        return
      }

      setVapiKey(profile.vapi_api_key)

      const res = await fetch('https://api.vapi.ai/call', {
        headers: { Authorization: `Bearer ${profile.vapi_api_key}` },
      })

      if (!res.ok) throw new Error(await res.text())

      const data = await res.json()
      const formatted = Array.isArray(data) ? data : []
      setCalls(formatted.length > 0 ? formatted : demoCalls)
    } catch (err: any) {
      console.error(err)
      setCalls(demoCalls)
      setError('Using demo data. Connect Vapi for live calls.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalls()
  }, [])

  const refreshCalls = async () => {
    setRefreshing(true)
    await loadCalls()
    setRefreshing(false)
  }

  const simulateNewCall = () => {
    const newCall: Call = {
      id: 'sim-' + Date.now(),
      startedAt: new Date().toISOString(),
      endedAt: new Date(Date.now() + 1000 * 60 * 4).toISOString(),
      customer: { number: '+44 7123 456789' },
      analysis: { summary: 'Patient requested a follow-up appointment regarding blood test results.' },
      transcript: [
        { role: 'assistant', message: 'Good afternoon. How can I help you today?' },
        { role: 'user', message: 'I got my blood test results and would like to speak to the doctor.' },
      ],
    }
    setCalls(prev => [newCall, ...prev])
    setSelected(newCall)
  }

  const getStatus = (call: Call) => {
    const summary = (call.analysis?.summary || '').toLowerCase()
    if (summary.includes('emergency') || summary.includes('999')) {
      return { label: 'Emergency Forwarded', color: 'bg-red-100 text-red-700' }
    }
    if (summary.includes('scam') || summary.includes('spam') || summary.includes('warranty')) {
      return { label: 'Scammer Blocked', color: 'bg-gray-100 text-gray-600' }
    }
    if (summary.includes('booked') || summary.includes('appointment')) {
      return { label: 'Appointment Booked', color: 'bg-emerald-100 text-emerald-700' }
    }
    return { label: 'Handled', color: 'bg-blue-100 text-blue-700' }
  }

  const formatDuration = (start: string, end: string) => {
    if (!start || !end) return '—'
    const secs = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000)
    return `${Math.floor(secs / 60)}m ${secs % 60}s`
  }

  const filteredCalls = calls
    .filter((c) => {
      const status = getStatus(c)
      if (filter !== 'all' && status.label !== filter) return false
      if (search && !JSON.stringify(c).toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())

  const statusOptions = ['all', 'Handled', 'Appointment Booked', 'Emergency Forwarded', 'Scammer Blocked']

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
              onClick={simulateNewCall}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition"
            >
              <Play size={16} /> Simulate Call
            </button>
            <button 
              onClick={refreshCalls}
              disabled={refreshing}
              className="flex items-center gap-2 px-5 py-2.5 border border-bordergray hover:bg-gray-50 rounded-xl font-semibold text-sm transition"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {!vapiKey && !loading && (
          <div className="mb-8 border border-blue-200 bg-blue-50 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="font-semibold text-blue-900 mb-1">Live calls are using demo data</div>
              <p className="text-blue-700 text-sm">Connect your Vapi account in Settings to see real calls, transcripts and analytics.</p>
            </div>
            <Link href="/settings" className="btn btn-primary whitespace-nowrap">
              Go to Settings
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search calls by caller, summary, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input w-full pl-11 py-3 border border-bordergray rounded-2xl text-sm bg-white"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn px-5 py-2 rounded-2xl text-sm font-medium border transition ${
                  filter === f 
                    ? 'bg-electriclight border-electric text-electric' 
                    : 'bg-white border-bordergray hover:bg-gray-50 text-gray-700'
                }`}
              >
                {f === 'all' ? 'All' : f}
                <span className="ml-1.5 opacity-60">
                  ({f === 'all' ? calls.length : calls.filter(c => getStatus(c).label === f).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Calls Table */}
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6">Date &amp; Time</th>
                <th>Caller</th>
                <th>Duration</th>
                <th>Status</th>
                <th className="max-w-md">AI Summary</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td colSpan={6} className="px-6 py-4"><div className="skeleton h-5 w-3/4 rounded" /></td>
                  </tr>
                ))
              ) : filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="text-gray-400">No calls match your filters.</div>
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => {
                  const status = getStatus(call)
                  return (
                    <tr 
                      key={call.id} 
                      className="border-t hover:bg-gray-50/50 cursor-pointer transition"
                      onClick={() => setSelected(call)}
                    >
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {new Date(call.startedAt).toLocaleString([], { 
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                        })}
                      </td>
                      <td className="font-medium">{call.customer?.number || 'Unknown'}</td>
                      <td className="text-sm text-gray-600">{formatDuration(call.startedAt, call.endedAt)}</td>
                      <td>
                        <span className={`status-pill ${status.color}`}>{status.label}</span>
                      </td>
                      <td className="text-sm text-gray-600 pr-6 max-w-md truncate">
                        {call.analysis?.summary || '—'}
                      </td>
                      <td className="px-6">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelected(call) }}
                          className="px-4 py-1.5 text-xs font-semibold border border-bordergray hover:bg-white rounded-xl"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" /> 
          {filteredCalls.length} calls shown
          {vapiKey ? ' • Live from Vapi' : ' • Demo mode'}
        </div>
      </main>

      {/* Call Detail Panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex z-50" onClick={() => setSelected(null)}>
          <div 
            className="call-detail ml-auto w-full max-w-lg bg-white h-full overflow-y-auto border-l border-bordergray"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="font-semibold text-xl">{selected.customer?.number}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(selected.startedAt).toLocaleString()} • {formatDuration(selected.startedAt, selected.endedAt)}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700">
                  <X size={22} />
                </button>
              </div>

              <div className="mb-8">
                <div className="text-xs font-semibold tracking-wider text-electric mb-2">AI SUMMARY</div>
                <div className="bg-electriclight rounded-2xl p-5 text-sm leading-relaxed">
                  {selected.analysis?.summary || 'No summary available.'}
                </div>
              </div>

              <div className="mb-8">
                <div className="text-xs font-semibold tracking-wider text-gray-500 mb-2">OUTCOME</div>
                <div className={`inline-block px-4 py-1.5 rounded-2xl text-sm font-semibold ${getStatus(selected).color}`}>
                  {getStatus(selected).label}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold tracking-wider text-gray-500">FULL TRANSCRIPT</div>
                  <button 
                    onClick={() => {
                      const text = (selected.transcript || []).map(m => `${m.role.toUpperCase()}: ${m.message || m.content}`).join('\n\n')
                      navigator.clipboard.writeText(text)
                      alert('Transcript copied!')
                    }}
                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
                  >
                    <Download size={14} /> Copy
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  {(selected.transcript || []).length > 0 ? (
                    selected.transcript.map((msg: any, i: number) => (
                      <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-end' : ''}`}>
                        <div className={`max-w-[85%] px-4 py-3 rounded-3xl ${
                          msg.role === 'assistant' 
                            ? 'bg-electric text-white rounded-tr-none' 
                            : 'bg-gray-100 rounded-tl-none'
                        }`}>
                          {msg.message || msg.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-6 text-sm text-gray-500 text-center">
                      No transcript available for this call.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t text-xs text-gray-400">
                Call ID: {selected.id}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug modal */}
      {debugError && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-6" onClick={() => setDebugError('')}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
            <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-[70vh]">{debugError}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
