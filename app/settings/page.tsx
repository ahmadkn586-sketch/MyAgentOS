'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function SettingsPage() {
  const [vapiKey, setVapiKey] = useState('')
  const [vapiNumber, setVapiNumber] = useState('')
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold mb-8">Settings</h1>

        <div className="card p-8 mb-8">
          <h2 className="font-semibold mb-4">Vapi Integration</h2>
          
          <label className="block text-sm mb-1">Vapi API Key</label>
          <input 
            value={vapiKey} 
            onChange={e => setVapiKey(e.target.value)} 
            className="w-full border border-bordergray rounded-2xl px-4 py-3 mb-4" 
            placeholder="sk_live_..." 
          />

          <label className="block text-sm mb-1">Vapi Phone Number</label>
          <input 
            value={vapiNumber} 
            onChange={e => setVapiNumber(e.target.value)} 
            className="w-full border border-bordergray rounded-2xl px-4 py-3 mb-6" 
            placeholder="+44 20 7946 0958" 
          />

          <button onClick={save} className="btn btn-primary">Save Keys</button>
          {saved && <p className="text-green-600 mt-3 text-sm">Saved!</p>}
        </div>
      </main>
    </div>
  )
}
