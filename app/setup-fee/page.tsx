'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Check } from 'lucide-react'

export default function SetupFeePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setChecking(false)
    }
    checkUser()
  }, [])

  const handlePayment = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Mark setup as complete. Real Stripe checkout gets wired in here later —
      // for now this lets you test the full flow end to end.
      await supabase
        .from('profiles')
        .update({ setup_complete: true })
        .eq('id', user.id)

      router.push('/dashboard')
    }
    setLoading(false)
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-sidebargray flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-bordergray p-10 max-w-md w-full text-center">
        <div className="w-10 h-10 bg-electric rounded-lg mx-auto mb-6"></div>
        <h1 className="text-2xl font-extrabold mb-1">One-time Professional Setup — £499.</h1>
        <p className="text-gray-500 text-sm mb-8">Paid once. Never again.</p>

        <ul className="text-left space-y-3 text-sm mb-8">
          <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> AI Brain configuration by our team</li>
          <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Vapi assistant setup and testing</li>
          <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Number forwarding setup and verification</li>
          <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> 30 days onboarding support included</li>
        </ul>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-electric text-white py-3.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay £499 and Access Your Dashboard'}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Secure payment via Stripe. You will be redirected to your dashboard immediately after payment.
        </p>
        <p className="text-sm font-medium mt-6">
          14-day money back guarantee if AgentOS isn't right for your practice.
        </p>
      </div>
    </div>
  )
}
