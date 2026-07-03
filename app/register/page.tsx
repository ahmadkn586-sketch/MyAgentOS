'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    businessName: '',
    email: '',
    password: '',
    businessType: 'Medical Practice',
    plan: 'growth',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Update the profile with business details (profile row was auto-created by trigger)
      await supabase
        .from('profiles')
        .update({
          business_name: form.businessName,
          business_type: form.businessType,
          plan: form.plan,
        })
        .eq('id', data.user.id)

      router.push('/setup-fee')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-sidebargray flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-bordergray p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-electric rounded-lg mx-auto mb-4"></div>
          <h1 className="text-2xl font-extrabold mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm">Your AI employee will be ready within 24 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full border border-bordergray rounded-lg px-4 py-3 text-sm"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Business Name"
            required
            className="w-full border border-bordergray rounded-lg px-4 py-3 text-sm"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border border-bordergray rounded-lg px-4 py-3 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full border border-bordergray rounded-lg px-4 py-3 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="w-full border border-bordergray rounded-lg px-4 py-3 text-sm"
            value={form.businessType}
            onChange={(e) => setForm({ ...form, businessType: e.target.value })}
          >
            <option>Medical Practice</option>
            <option>Dental Practice</option>
            <option>Architecture Firm</option>
            <option>Engineering Firm</option>
            <option>Law Office</option>
            <option>Consulting Firm</option>
            <option>Other</option>
          </select>

          <div className="grid grid-cols-3 gap-2">
            {['starter', 'growth', 'scale'].map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setForm({ ...form, plan: p })}
                className={`border rounded-lg py-2.5 text-sm font-semibold capitalize transition ${
                  form.plan === p ? 'border-electric bg-electriclight text-electric' : 'border-bordergray text-gray-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-electric text-white py-3.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Get Started'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link href="/login" className="text-electric font-semibold">Login</Link>
        </p>
      </div>
    </div>
  )
}
