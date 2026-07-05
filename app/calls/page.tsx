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
    { id: 'demo-1', startedAt: new Date(Date.now() - 1000*60*45).toISOString(), endedAt: new Date(Date.now() - 1000*60*38).toISOString(), customer: { number: '+44 20 7946 0958' }, analysis: { summary: 'Patient booked appointment for next Tuesday at 2pm.' }, transcript: [{ role: 'assistant', message: 'Good afternoon, thank you for calling.' }] },
    { id: 'demo-2', startedAt: new Date(Date.now() - 1000*60*120).toISOString(), endedAt: new Date(Date.now() - 1000*60*115).toISOString(), customer: { number: '+44 7700 900123' }, analysis: { summary: 'Spam call blocked.' }, transcript: [] },
  ]

  const loadCalls = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setCalls(demoCalls); setLoading(false); return }
      const { data: profile } = await supabase.from('profiles').select('vapi_api_key').eq('id', user.id).single()
      if (!profile?.vapi_api_key) { setCalls(demoCalls); setLoading(false); return }
      setVapiKey(profile.vapi_api_key)
      const res = await fetch('https://api.vapi.ai/call', { headers: { Authorization: `Bearer ${profile.vapi_api_key}` } })
      const data = await res.json()
      setCalls(Array.isArray(data) && data.length ? data : demoCalls)
    } catch { setCalls(demoCalls) }
    setLoading(false)
  }

  useEffect(() => { loadCalls() }, [])

  const filteredCalls = calls.filter(c => {
    if (filter !== 'all' && !c.analysis?.summary?.toLowerCase().includes(filter.toLowerCase())) return false
    if (search && !JSON.stringify(c).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

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
            <button onClick={() => { const nc = { id: 'sim-'+Date.now(), startedAt: new Date().toISOString(), endedAt: new Date(Date.now()+240000).toISOString(), customer: { number: '+44 7123 456789' }, analysis: { summary: 'Test call' }, transcript: [] }; setCalls(p => [nc, ...p]); setSelected(nc) }} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm">Simulate Call</button>
            <button onClick={loadCalls} className="px-5 py-2.5 border border-bordergray rounded-xl font-semibold text-sm">Refresh</button>
          </div>
        </div>

        {!vapiKey && <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-3xl">Using demo data. Add Vapi key in Settings.</div>}

        <div className="flex gap-4 mb-6">
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border border-bordergray rounded-2xl px-4 py-3" />
          {['all','Handled','Appointment Booked','Emergency Forwarded'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-2xl text-sm font-medium border ${filter===f ? 'bg-electriclight border-electric text-electric' : 'border-bordergray'}`}>{f}</button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <table className="w-full">
            <thead><tr><th className="px-6 py-3 text-left">Date</th><th>Caller</th><th>Status</th><th>Summary</th><th></th></tr></thead>
            <tbody>
              {filteredCalls.map(call => (
                <tr key={call.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(call)}>
                  <td className="px-6 py-4">{new Date(call.startedAt).toLocaleString()}</td>
                  <td>{call.customer?.number}</td>
                  <td><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{call.analysis?.summary?.includes('appointment') ? 'Appointment Booked' : 'Handled'}</span></td>
                  <td className="text-sm text-gray-600">{call.analysis?.summary}</td>
                  <td className="px-6"><button className="text-sm border px-3 py-1 rounded-lg">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-end" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-md p-8 overflow-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="float-right"><X /></button>
            <h2 className="font-bold text-xl mb-2">{selected.customer?.number}</h2>
            <p className="text-sm text-gray-500 mb-6">{new Date(selected.startedAt).toLocaleString()}</p>
            <div className="bg-electriclight p-4 rounded-2xl mb-6">
              <div className="text-xs font-semibold text-electric mb-1">AI SUMMARY</div>
              {selected.analysis?.summary || 'No summary'}
            </div>
            <div className="font-semibold mb-2">Transcript</div>
            {(selected.transcript || []).length > 0 ? selected.transcript.map((m:any,i:number) => (
              <div key={i} className="mb-3 text-sm">{m.role}: {m.message}</div>
            )) : <div className="text-gray-400">No transcript</div>}
          </div>
        </div>
      )}
    </div>
  )
}
