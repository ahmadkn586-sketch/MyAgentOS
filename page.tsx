'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'
import { Check } from 'lucide-react'

const plans = [
  {
    key: 'starter', name: 'Starter', price: 89, priceAnnual: 71,
    desc: 'For practices that want to test the waters.',
    features: ['1 AI Phone Employee', 'Up to 150 calls/month (roughly 5/day)', 'Basic AI responses only', 'Call logs, no summaries', 'No appointment booking', 'No emergency forwarding'],
  },
  {
    key: 'growth', name: 'Growth', price: 279, priceAnnual: 223,
    desc: 'The complete AI employee for growing practices.', popular: true,
    features: ['3 AI Phone Employees', 'Up to 3,000 calls/month', 'Full AI Brain training', 'Smart call summaries', 'Automated appointment booking', 'Emergency call forwarding', 'Custom branding'],
  },
  {
    key: 'scale', name: 'Scale', price: 699, priceAnnual: 559,
    desc: 'For high volume practices where every call matters.',
    features: ['8 AI Phone Employees', 'Up to 10,000 calls/month', 'Everything in Growth', 'SMS emergency alerts', 'Full transcripts with AI analysis', 'Same day priority support'],
  },
]

export default function BillingPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [annual, setAnnual] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    load()
  }, [])

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-extrabold mb-1">Billing</h1>
        <p className="text-gray-500 mb-8">Manage your subscription and payment.</p>

        {profile && (
          <div className="bg-electriclight rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Plan</p>
              <p className="text-xl font-extrabold capitalize">{profile.plan} · Billed {profile.billing_cycle}</p>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full p-1 flex gap-1">
            <button onClick={() => setAnnual(false)} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${!annual ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 ${annual ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Annual <span className="text-success text-xs">Save 20%</span></button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = profile?.plan === plan.key
            return (
              <div key={plan.key} className={`rounded-2xl p-6 relative ${plan.popular ? 'border-2 border-electric shadow-lg' : 'border border-bordergray'}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
                <p className="text-3xl font-extrabold mb-4">£{annual ? plan.priceAnnual : plan.price}<span className="text-sm font-medium text-gray-500">/mo</span></p>
                <ul className="space-y-2 text-sm mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2"><Check size={16} className="text-success shrink-0 mt-0.5" /> {f}</li>
                  ))}
                </ul>
                <button disabled={isCurrent} className={`w-full py-2.5 rounded-lg text-sm font-semibold ${isCurrent ? 'bg-gray-100 text-gray-400' : plan.popular ? 'bg-electric text-white' : 'border border-bordergray'}`}>
                  {isCurrent ? 'Current Plan' : 'Get Started'}
                </button>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm font-medium mt-8">14-day money back guarantee. No questions asked.</p>
        <p className="text-center text-xs text-gray-400 mt-1">Pricing includes all AI infrastructure costs. No hidden fees.</p>
      </main>
    </div>
  )
}
