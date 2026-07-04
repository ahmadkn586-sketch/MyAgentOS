'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import {
  LayoutGrid, Brain, Phone, Calendar, MessageSquare, Workflow,
  Plug, BarChart3, BookOpen, Users, CreditCard, Settings, LogOut
} from 'lucide-react'

const nav = [
  { section: 'WORKSPACE', items: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { label: 'AI Brain', href: '/ai-brain', icon: Brain },
  ]},
  { section: 'FEATURES', items: [
    { label: 'Calls', href: '/calls', icon: Phone },
    { label: 'Appointments', href: '/appointments', icon: Calendar },
    { label: 'Messages', href: '/messages', icon: MessageSquare, soon: true },
  ]},
  { section: 'AUTOMATE', items: [
    { label: 'Automations', href: '/automations', icon: Workflow, soon: true },
    { label: 'Integrations', href: '/integrations', icon: Plug, soon: true },
  ]},
  { section: 'INSIGHTS', items: [
    { label: 'Analytics', href: '/analytics', icon: BarChart3, soon: true },
    { label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen, soon: true },
  ]},
  { section: 'ACCOUNT', items: [
    { label: 'AI Employees', href: '/ai-employees', icon: Users },
    { label: 'Billing', href: '/billing', icon: CreditCard },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<{ business_name: string; plan: string } | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('business_name, plan')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  const handleSoonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setToast('Coming Soon — this feature is on its way')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <aside className="w-64 min-h-screen bg-sidebargray border-r border-bordergray flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-2">
          <div className="w-9 h-9 bg-electric rounded-lg"></div>
          <span className="font-bold text-lg">AgentOS</span>
        </div>

        <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
          {nav.map((section) => (
            <div key={section.section}>
              <p className="text-xs font-semibold text-gray-400 px-3 mb-2 tracking-wide">{section.section}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.soon ? '#' : item.href}
                      onClick={item.soon ? handleSoonClick : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        active ? 'bg-electriclight text-electric' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1">{item.label}</span>
                      {item.soon && (
                        <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-semibold">SOON</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-bordergray">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-electric text-white rounded-full flex items-center justify-center font-bold text-sm">
              {profile?.business_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{profile?.business_name || 'Loading...'}</p>
              <span className="text-xs bg-electriclight text-electric px-1.5 py-0.5 rounded font-medium capitalize">
                {profile?.plan || 'starter'}
              </span>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm z-50">
          {toast}
        </div>
      )}
    </>
  )
}
