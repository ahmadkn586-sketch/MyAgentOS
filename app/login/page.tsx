'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  // Demo login helper
  const loginAsDemo = () => {
    setEmail('demo@agentos.app')
    setPassword('demo123')
    // In a real app you'd sign in, here we just redirect
    setTimeout(() => router.push('/dashboard'), 800)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-11 h-11 bg-electric rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-3xl">A</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your AgentOS account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border border-bordergray rounded-2xl px-4 py-3" 
              placeholder="you@practice.com" 
              required 
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border border-bordergray rounded-2xl px-4 py-3" 
              required 
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn btn-primary py-3.5 text-base mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button 
            onClick={loginAsDemo} 
            className="text-sm text-electric hover:underline"
          >
            Quick demo login
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-electric">Create one</Link>
        </div>
      </div>
    </div>
  )
}
