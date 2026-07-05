'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'
import { Copy, Check } from 'lucide-react'

export default function SettingsPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState('')
  const [toast, setToast] = useState('')
  const [copied, setCopied] = useState(false)

  const [vapiKey, setVapiKey] = useState('')
  const [vapiNumber, setVapiNumber] = useState('')
  const [account, setAccount] = useState({ full_name: '', business_name: '', email: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Demo mode
        setAccount({ full_name: 'Dr. Sarah Patel', business_name: 'City Medical Practice', email: 'demo@agentos.app' })
        setVapiNumber('+44 20 7946 0958')
        setLoading(false)
        return
      }
      setUserId(user.id)

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setVapiKey(data.vapi_api_key || '')
        setVapiNumber(data.vapi_phone_number || '')
        setAccount({
          full_name: data.full_name || '',
          business_name: data.business_name || '',
          email: data.email || user.email || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
  }

  const saveKeys = async () => {
    if (!userId) {
      showToast('Demo mode: Changes saved locally')
      return
    }
    await supabase.from('profiles').update({ 
      vapi_api_key: vapiKey, 
      vapi_phone_number: vapiNumber 
    }).eq('id', userId)
    showToast('Integration keys saved successfully!')
  }

  const saveAccount = async () => {
    if (!userId) {
      showToast('Demo mode: Account updated')
      return
    }
    await supabase.from('profiles').update({
      full_name: account.full_name,
      business_name: account.business_name
    }).eq('id', userId)
    showToast('Account details saved.')
  }

  const copyNumber = () => {
    if (!vapiNumber) return
    navigator.clipboard.writeText(vapiNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Settings</h1>
        <p className="text-gray-500 mb-8">Manage your account and integrations.</p>

        {/* Phone Number */}
        <div className="card p-8 mb-8">
          <h2 className="font-semibold text-xl mb-4">Your AgentOS Phone Number</h2>
          
          {vapiNumber ? (
            <div className="flex items-center justify-between bg-electriclight rounded-2xl p-5 mb-4">
              <div className="font-mono text-2xl font-semibold tracking-tight">{vapiNumber}</div>
              <button onClick={copyNumber} className="flex items-center gap-2 text-sm px-4 py-2 bg-white rounded-xl border">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-5 mb-4 text-sm">
              Enter your Vapi phone number below to see it here.
            </div>
          )}

          <p className="text-sm text-gray-600 mb-6">
            Forward your existing business number to this AgentOS number to start receiving calls.
          </p>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="text-sm font-medium block mb-1.5">Vapi Phone Number</label>
              <input 
                value={vapiNumber} 
                onChange={(e) => setVapiNumber(e.target.value)} 
                placeholder="+44 20 7946 0958" 
                className="w-full border border-bordergray rounded-2xl px-4 py-3" 
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Vapi API Key</label>
              <input 
                value={vapiKey} 
                onChange={(e) => setVapiKey(e.target.value)} 
                placeholder="sk_live_..." 
                className="w-full border border-bordergray rounded-2xl px-4 py-3" 
              />
            </div>
            <button onClick={saveKeys} className="btn btn-primary w-fit px-8">Save Integration Keys</button>
          </div>
        </div>

        {/* Account */}
        <div className="card p-8 mb-8">
          <h2 className="font-semibold text-xl mb-5">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm mb-1.5">Full Name</label>
              <input 
                value={account.full_name} 
                onChange={(e) => setAccount({ ...account, full_name: e.target.value })} 
                className="w-full border border-bordergray rounded-2xl px-4 py-3" 
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5">Business Name</label>
              <input 
                value={account.business_name} 
                onChange={(e) => setAccount({ ...account, business_name: e.target.value })} 
                className="w-full border border-bordergray rounded-2xl px-4 py-3" 
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-sm mb-1.5">Email</label>
            <input value={account.email} disabled className="w-full border border-bordergray bg-gray-50 rounded-2xl px-4 py-3" />
          </div>
          <button onClick={saveAccount} className="btn btn-secondary mt-5 px-8">Save Account Changes</button>
        </div>

        {/* Danger Zone */}
        <div className="card p-8 border-red-200">
          <h2 className="font-semibold text-xl text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-600 mb-4">This action is permanent.</p>
          <button 
            onClick={() => alert('Demo: Account deletion would be handled here.')}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-2xl hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>

        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white shadow-lg border px-6 py-3 rounded-2xl text-sm font-medium">
            {toast}
          </div>
        )}
      </main>
    </div>
  )
}
