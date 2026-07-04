'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import {
  LayoutGrid, Brain, Phone, Calendar, MessageSquare, Workflow,
  Plug, BarChart3, BookOpen, Users, CreditCard, Settings, LogOut,
  ChevronRight
} from 'lucide-react'

const nav = [
  {
    section: 'WORKSPACE',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
      { label: 'AI Brain', href: '/ai-brain', icon: Brain },
    ],
  },
  {
    section: 'FEATURES',
    items: [
      { label: 'Calls', href: '/calls', icon: Phone },
      { label: 'Appointments', href: '/appointments', icon: Calendar },
      { label: 'Messages', href: '/messages', icon: MessageSquare, soon: true },
    ],
  },
  {
    section: 'AUTOMATE',
    items: [
      { label: 'Automations', href: '/automations', icon: Workflow, soon: true },
      { label: 'Integrations', href: '/integrations', icon: Plug, soon: true },
    ],
  },
  {
    section: 'INSIGHTS',
    items: [
      { label: 'Analytics', href: '/analytics', icon: BarChart3, soon: true },
      { label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen, soon: true },
    ],
  },
  {
    section: 'ACCOUNT',
    items: [
      { label: 'AI Employees', href: '/ai-employees', icon: Users },
      { label: 'Billing', href: '/billing', icon: CreditCard },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
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
      <aside className="w-72 border-r border-bordergray bg-white h-screen flex flex-col fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-bordergray">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-electric rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <div className="font-bold text-2xl tracking-tight">AgentOS</div>
              <div className="text-[10px] text-gray-400 -mt-1">AI PHONE EMPLOYEE</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        {profile && (
          <div className="px-6 py-4 border-b border-bordergray bg-sidebargray">
            <div className="font-semibold text-sm">{profile.business_name || 'Your Practice'}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              {profile.plan?.toUpperCase() || 'STARTER'} PLAN
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 text-sm">
          {nav.map((section) => (
            <div key={section.section} className="mb-1">
              <div className="sidebar-section">{section.section}</div>
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                if (item.soon) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={handleSoonClick}
                      className="sidebar-link justify-between opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-px rounded">SOON</span>
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-bordergray">
          <button
            onClick={handleSignOut}
            className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] toast">
          <div className="bg-white border border-bordergray shadow-lg rounded-2xl px-5 py-3 flex items-center gap-3 text-sm">
            <div>{toast}</div>
          </div>
        </div>
      )}
    </>
  )
}
