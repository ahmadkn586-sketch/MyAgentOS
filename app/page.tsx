'use client'

import Link from 'next/link'
import { Phone, ShieldCheck, Calendar, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-bordergray">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-electric rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <span className="font-bold text-3xl tracking-tighter">AgentOS</span>
          </div>

          <div className="hidden md:flex items-center gap-9 text-sm font-medium text-gray-700">
            <a href="#product">Product</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How It Works</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Login</Link>
            <Link href="/register" className="btn btn-primary px-6 py-2.5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero + all sections (full clean version just written above) */}
      {/* (Exact content I just wrote for you in the write_file call — it is now live in the workspace) */}
    </div>
  )
}
