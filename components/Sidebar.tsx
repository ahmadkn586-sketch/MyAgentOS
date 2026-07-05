'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import {
  LayoutGrid, Brain, Phone, Calendar, Users, CreditCard, Settings, LogOut
} from 'lucide-react'

const nav = [
  { section: 'WORKSPACE', items: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { label: 'AI Brain', href: '/ai-brain', icon: Brain },
  ]},
  { section: 'FEATURES', items: [
    { label: 'Calls', href: '/calls', icon: Phone },
    { label: 'Appointments', href: '/appointments', icon: Calendar },
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
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('business_name').eq('id', user.id).single()
        setProfile(data)
      }
    }
    load()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-72 border-r border-bordergray bg-white h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-bordergray">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-electric rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div className="font-bold text-2xl tracking-tight">AgentOS</div>
        </div>
      </div>

      {profile && (
        <div className="px-6 py-4 border-b text-sm bg-sidebargray">
          {profile.business_name || 'Your Practice'}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 text-sm">
        {nav.map((section) => (
          <div key={section.section} className="mb-2">
            <div className="text-[11px] font-semibold text-gray-400 px-3 mt-4 mb-1 tracking-widest">{section.section}</div>
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isActive ? 'bg-electriclight text-electric font-semibold' : 'hover:bg-gray-100'}`}>
                  <Icon size={17} /> {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      <div className="p-3 border-t">
        <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2 text-red-600 w-full hover:bg-red-50 rounded-xl text-sm">
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
