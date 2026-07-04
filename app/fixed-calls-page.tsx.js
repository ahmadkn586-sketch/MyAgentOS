'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

export default function CallsPage() {
  const supabase = createClient()

  const [calls, setCalls] = useState<any[]>([])
  const [vapiKey, setVapiKey] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [debugError, setDebugError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('vapi_api_key')
        .eq('id', user.id)
        .single()

      if (!profile?.vapi_api_key) {
        setLoading(false)
        return
      }

      setVapiKey(profile.vapi_api_key)

      try {
        const res = await fetch('https://api.vapi.ai/call', {
          headers: {
            Authorization: `Bearer ${profile.vapi_api_key}`,
          },
        })

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(errText || `Vapi returned status ${res.status}`)
        }

        const data = await res.json()
        setCalls(Array.isArray(data) ? data : [])
      } catch (err: any) {
        setError(err.message || 'Could not connect to Vapi.')
      }

      setLoading(false)
    }

    load()
  }, [])

  const getStatus = (call: any) => {
    const summary = (call.analysis?.summary || '').toLowerCase()

    if (summary.includes('emergency')) {
      return { label: 'Emergency Forwarded', color: 'bg-red-50 text-danger' }
    }
    if (summary.includes('scam') || summary.includes('spam') || summary.includes('robocall')) {
      return { label: 'Scammer Blocked', color: 'bg-gray-100 text-gray-600' }
    }
    if (summary.includes('appointment') || summary.includes('booked')) {
      return { label: 'Appointment Booked', color: 'bg-green-50 text-success' }
    }
    return { label: 'Handled', color: 'bg-electriclight text-electric' }
  }

  const formatDuration = (start: string, end: string) => {
    if (!start || !end) return '—'
    const secs = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000)
    return `${Math.floor(secs / 60)}m ${secs % 60}s`
  }

  const filteredCalls = calls.filter((c) => {
    const status = getStatus(c)

    if (filter !== 'all' && status.label !== filter) return false

    if (search && !JSON.stringify(c).toLowerCase().includes(search.toLowerCase())) return false

    return true
  })

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-extrabold mb-1">Calls</h1>
        <p className="text-gray-500 mb-8">Complete log of every call your AI has handled.</p>

        {!vapiKey && !loading && (
          <div className="border border-bordergray rounded-2xl p-12 text-center">
            <p className="font-bold mb-2">Connect your Vapi account to see live call data</p>
            <p className="text-gray-500 text-sm mb-6">
              Your calls will appear here once Vapi is connected.
            </p>
            <Link
              href="/settings"
              className="bg-electric text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              Go to Settings
            </Link>
          </div>
        )}

        {error && (
          <div className="border border-red-200 bg-red-50 rounded-2xl p-6 mb-6">
            <p className="font-bold text-danger mb-1">Couldn't load calls</p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        )}

        {vapiKey && !error && (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by caller, summary or status..."
                className="w-full border border-bordergray rounded-lg pl-11 pr-4 py-3 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {['all', 'Handled', 'Emergency Forwarded', 'Scammer Blocked', 'Appointment Booked'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === f ? 'bg-electriclight text-electric' : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {f === 'all' ? 'All' : f} (
                  {f === 'all'
                    ? calls.length
                    : calls.filter((c) => getStatus(c).label === f).length}
                  )
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="border border-bordergray rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-4 py-3">Date &amp; Time</th>
                    <th className="px-4 py-3">Caller</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">AI Summary</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCalls.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        No calls yet. Once your AI handles calls, they'll appear here.
                      </td>
                    </tr>
                  )}

                  {filteredCalls.map((call) => {
                    const status = getStatus(call)
                    return (
                      <tr key={call.id} className="border-t border-bordergray">
                        <td className="px-4 py-3">
                          {new Date(call.startedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {call.customer?.number || 'Unknown'}
                        </td>
                        <td className="px-4 py-3">
                          {formatDuration(call.startedAt, call.endedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 truncate max-w-xs">
                          {call.analysis?.summary || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              try {
                                setSelected(call)
                              } catch (e: any) {
                                setDebugError(
                                  e.message + '\n\n' + JSON.stringify(call, null, 2).slice(0, 2000)
                                )
                              }
                            }}
                            className="border border-bordergray px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* Detail Sidebar */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/30 flex justify-end z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full max-w-md h-full overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-bold">{selected.customer?.number}</p>
                <p className="text-sm text-gray-500">
                  {new Date(selected.startedAt).toLocaleString()} ·{' '}
                  {formatDuration(selected.startedAt, selected.endedAt)}
                </p>
              </div>
              <button onClick={() => setSelected(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="bg-electriclight rounded-lg p-4 mb-6">
              <p className="text-xs font-semibold text-electric mb-1">AI SUMMARY</p>
              <p className="text-sm">{selected.analysis?.summary || 'No summary available.'}</p>
            </div>

            <p className="font-bold mb-3">Full Transcript</p>
            <div className="space-y-3">
              {(selected.transcript || []).map((msg: any, i: number) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'assistant' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'assistant' ? 'bg-electriclight text-electric' : 'bg-gray-100'
                    }`}
                  >
                    {msg.message || msg.content}
                  </div>
                </div>
              ))}

              {(!selected.transcript || selected.transcript.length === 0) && (
                <p className="text-sm text-gray-400">No transcript available for this call.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Debug Error Modal */}
      {debugError && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-6"
          onClick={() => setDebugError('')}
        >
          <pre className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto text-xs whitespace-pre-wrap">
            {debugError}
          </pre>
        </div>
      )}
    </div>
  )
}
