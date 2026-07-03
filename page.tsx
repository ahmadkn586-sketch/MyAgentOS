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
  const [stripePk, setStripePk] = useState('')
  const [stripeSk, setStripeSk] = useState('')
  const [vapiConnected, setVapiConnected] = useState(false)
  const [stripeConnected, setStripeConnected] = useState(false)

  const [account, setAccount] = useState({ full_name: '', business_name: '', email: '' })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setVapiKey(data.vapi_api_key || '')
        setVapiNumber(data.vapi_phone_number || '')
        setVapiConnected(!!data.vapi_api_key)
        setStripeConnected(!!data.stripe_customer_id)
        setAccount({ full_name: data.full_name || '', business_name: data.business_name || '', email: data.email || '' })
      }
    }
    load()
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const saveKeys = async () => {
    await supabase.from('profiles').update({ vapi_api_key: vapiKey, vapi_phone_number: vapiNumber }).eq('id', userId)
    setVapiConnected(!!vapiKey)
    showToast('Integration keys saved.')
  }

  const saveAccount = async () => {
    await supabase.from('profiles').update({ full_name: account.full_name, business_name: account.business_name }).eq('id', userId)
    showToast('Account details saved.')
  }

  const copyNumber = () => {
    navigator.clipboard.writeText(vapiNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-10 max-w-3xl">
        <h1 className="text-3xl font-extrabold mb-1">Settings</h1>
        <p className="text-gray-500 mb-8">Manage your account and preferences.</p>

        <div className="space-y-6">
          <div className="border border-bordergray rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Your AgentOS Phone Number</h2>
            {vapiNumber ? (
              <div className="flex items-center gap-3 mb-3">
                <p className="text-2xl font-mono font-bold">{vapiNumber}</p>
                <button onClick={copyNumber} className="flex items-center gap-1.5 text-sm border border-bordergray px-3 py-1.5 rounded-lg">
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-3">Enter your Vapi phone number below to see it here.</p>
            )}
            <div className="bg-electriclight text-sm text-gray-700 rounded-lg p-4">
              Forward your existing business number to this number to activate AgentOS. This usually takes 2 minutes through your phone provider's settings.
            </div>
          </div>

          <div className="border border-bordergray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Integrations</h2>
            </div>

            <label className="text-sm font-medium mb-1.5 block">Vapi API Key</label>
            <div className="flex items-center gap-2 mb-1">
              <input type="password" className="flex-1 border border-bordergray rounded-lg px-4 py-2.5 text-sm" value={vapiKey} onChange={(e) => setVapiKey(e.target.value)} placeholder="Enter your Vapi API key" />
              {vapiConnected && <span className="text-xs font-semibold text-success flex items-center gap-1"><Check size={14} /> Connected</span>}
            </div>
            <p className="text-xs text-gray-400 mb-4">Used to fetch call data, transcripts, and analytics.</p>

            <label className="text-sm font-medium mb-1.5 block">Vapi Phone Number</label>
            <input className="w-full border border-bordergray rounded-lg px-4 py-2.5 text-sm mb-4" value={vapiNumber} onChange={(e) => setVapiNumber(e.target.value)} placeholder="+1 (000) 000 0000" />

            <label className="text-sm font-medium mb-1.5 block">Stripe Publishable Key</label>
            <input type="password" className="w-full border border-bordergray rounded-lg px-4 py-2.5 text-sm mb-4" value={stripePk} onChange={(e) => setStripePk(e.target.value)} placeholder="pk_live_..." />

            <label className="text-sm font-medium mb-1.5 block">Stripe Secret Key</label>
            <input type="password" className="w-full border border-bordergray rounded-lg px-4 py-2.5 text-sm mb-4" value={stripeSk} onChange={(e) => setStripeSk(e.target.value)} placeholder="sk_live_..." />

            <button onClick={saveKeys} className="bg-electric text-white px-6 py-2.5 rounded-lg text-sm font-semibold">Save Keys</button>
          </div>

          <div className="border border-bordergray rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Account Details</h2>
            <div className="space-y-3">
              <input placeholder="Full Name" className="w-full border border-bordergray rounded-lg px-4 py-2.5 text-sm" value={account.full_name} onChange={(e) => setAccount({ ...account, full_name: e.target.value })} />
              <input placeholder="Business Name" className="w-full border border-bordergray rounded-lg px-4 py-2.5 text-sm" value={account.business_name} onChange={(e) => setAccount({ ...account, business_name: e.target.value })} />
              <input disabled className="w-full border border-bordergray rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400" value={account.email} />
            </div>
            <button onClick={saveAccount} className="mt-4 bg-electric text-white px-6 py-2.5 rounded-lg text-sm font-semibold">Save Changes</button>
          </div>

          <div className="border border-red-200 rounded-2xl p-6">
            <h2 className="font-bold text-lg text-danger mb-2">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-4">Permanently deletes your account and all call data. This cannot be undone.</p>
            <button className="border border-danger text-danger px-5 py-2.5 rounded-lg text-sm font-semibold">Delete Account</button>
          </div>
        </div>
      </main>

      {toast && <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm z-50">{toast}</div>}
    </div>
  )
}
