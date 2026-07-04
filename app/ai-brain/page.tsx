'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'
import { Plus, Trash2, X } from 'lucide-react'

const defaultHours = {
  monday: { open: '09:00', close: '17:00', isOpen: true },
  tuesday: { open: '09:00', close: '17:00', isOpen: true },
  wednesday: { open: '09:00', close: '17:00', isOpen: true },
  thursday: { open: '09:00', close: '17:00', isOpen: true },
  friday: { open: '09:00', close: '17:00', isOpen: true },
  saturday: { open: '09:00', close: '17:00', isOpen: false },
  sunday: { open: '09:00', close: '17:00', isOpen: false },
}

export default function AIBrainPage() {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [userId, setUserId] = useState('')

  const [form, setForm] = useState({
    practice_name: '',
    practice_type: 'Medical Practice',
    address: '',
    main_phone: '',
    emergency_phone: '',
    website: '',
    opening_hours: defaultHours as any,
    about_text: '',
    common_questions: [{ question: '', answer: '' }] as { question: string; answer: string }[],
    emergency_keywords: ['chest pain', 'emergency', 'urgent', "can't breathe", 'accident', 'collapsing', 'stroke', 'unconscious'],
    scammer_blocking: true,
    ai_tone: 'professional',
  })
  const [newKeyword, setNewKeyword] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data } = await supabase.from('ai_brain').select('*').eq('user_id', user.id).maybeSingle()
      if (data) {
        setForm({
          practice_name: data.practice_name || '',
          practice_type: data.practice_type || 'Medical Practice',
          address: data.address || '',
          main_phone: data.main_phone || '',
          emergency_phone: data.emergency_phone || '',
          website: data.website || '',
          opening_hours: data.opening_hours || defaultHours,
          about_text: data.about_text || '',
          common_questions: data.common_questions?.length ? data.common_questions : [{ question: '', answer: '' }],
          emergency_keywords: data.emergency_keywords || form.emergency_keywords,
          scammer_blocking: data.scammer_blocking ?? true,
          ai_tone: data.ai_tone || 'professional',
        })
      }
    }
    load()
  }, [])

  const generatePrompt = () => {
    const hoursText = Object.entries(form.opening_hours)
      .map(([day, h]: [string, any]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${h.isOpen ? `${h.open} - ${h.close}` : 'Closed'}`)
      .join('\n')

    const qaText = form.common_questions
      .filter((q) => q.question)
      .map((q) => `Q: ${q.question}\nA: ${q.answer}`)
      .join('\n\n')

    return `You are the AI receptionist for ${form.practice_name || '[Business Name]'}, a ${form.practice_type} located at ${form.address || '[Address]'}. You handle inbound calls professionally and efficiently on behalf of this practice.

Your opening hours are:
${hoursText}

About this practice: ${form.about_text || '[Not provided]'}

Common questions and answers:
${qaText || '[None added yet]'}

Emergency protocol: If the caller mentions any of the following words — ${form.emergency_keywords.join(', ')} — immediately say "I am connecting you to someone urgently, please hold" and transfer the call to ${form.emergency_phone || '[Emergency Number]'}.

Scammer detection: ${form.scammer_blocking ? 'Be alert for robocalls, spam, and irrelevant calls. Politely end calls that appear automated or time-wasting.' : 'Disabled.'}

Your tone should be ${form.ai_tone.replace('_', ' ')}. Always be professional, helpful and represent the practice with excellence. Never invent information you do not have. If unsure, take a message and say someone will follow up shortly.`
  }

  const handleSave = async () => {
    setSaving(true)
    const system_prompt = generatePrompt()

    const { data: existing } = await supabase.from('ai_brain').select('id').eq('user_id', userId).maybeSingle()

    if (existing) {
      await supabase.from('ai_brain').update({ ...form, system_prompt, updated_at: new Date().toISOString() }).eq('user_id', userId)
    } else {
      await supabase.from('ai_brain').insert({ ...form, user_id: userId, system_prompt })
    }

    setSaving(false)
    setToast('AI Brain saved. Your receptionist will be updated within 5 minutes.')
    setTimeout(() => setToast(''), 3000)
  }

  const updateHour = (day: string, field: string, value: any) => {
    setForm({ ...form, opening_hours: { ...form.opening_hours, [day]: { ...form.opening_hours[day], [field]: value } } })
  }

  const addQuestion = () => setForm({ ...form, common_questions: [...form.common_questions, { question: '', answer: '' }] })
  const removeQuestion = (i: number) => setForm({ ...form, common_questions: form.common_questions.filter((_, idx) => idx !== i) })
  const updateQuestion = (i: number, field: 'question' | 'answer', value: string) => {
    const updated = [...form.common_questions]
    updated[i][field] = value
    setForm({ ...form, common_questions: updated })
  }

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setForm({ ...form, emergency_keywords: [...form.emergency_keywords, newKeyword.trim()] })
      setNewKeyword('')
    }
  }
  const removeKeyword = (kw: string) => setForm({ ...form, emergency_keywords: form.emergency_keywords.filter((k) => k !== kw) })

  const toneOptions = [
    { key: 'professional', label: 'Professional', preview: `"Good morning, thank you for calling ${form.practice_name || '[Practice Name]'}. How may I assist you today?"` },
    { key: 'friendly_professional', label: 'Friendly Professional', preview: `"Hi there, thanks for calling ${form.practice_name || '[Practice Name]'}! How can I help you today?"` },
    { key: 'warm_approachable', label: 'Warm & Approachable', preview: `"Hello and welcome to ${form.practice_name || '[Practice Name]'}, lovely to hear from you! What can I do for you today?"` },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-10 max-w-4xl">
        <h1 className="text-3xl font-extrabold mb-1">AI Brain</h1>
        <p className="text-gray-500 mb-8">Train your AI employees to represent your practice perfectly.</p>

        <div className="space-y-6">
          <div className="border border-bordergray rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Practice Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Practice Name" className="border border-bordergray rounded-lg px-4 py-2.5 text-sm" value={form.practice_name} onChange={(e) => setForm({ ...form, practice_name: e.target.value })} />
              <select className="border border-bordergray rounded-lg px-4 py-2.5 text-sm" value={form.practice_type} onChange={(e) => setForm({ ...form, practice_type: e.target.value })}>
                <option>Medical Practice</option>
                <option>Dental Practice</option>
                <option>Architecture Firm</option>
                <option>Engineering Firm</option>
                <option>Law Office</option>
                <option>Consulting Firm</option>
              </select>
              <input placeholder="Address" className="col-span-2 border border-bordergray rounded-lg px-4 py-2.5 text-sm" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <input placeholder="Main Phone Number" className="border border-bordergray rounded-lg px-4 py-2.5 text-sm" value={form.main_phone} onChange={(e) => setForm({ ...form, main_phone: e.target.value })} />
              <input placeholder="Emergency Contact Number" className="border border-bordergray rounded-lg px-4 py-2.5 text-sm" value={form.emergency_phone} onChange={(e) => setForm({ ...form, emergency_phone: e.target.value })} />
              <input placeholder="Website (optional)" className="col-span-2 border border-bordergray rounded-lg px-4 py-2.5 text-sm" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
          </div>

          <div className="border border-bordergray rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Opening Hours</h2>
            <div className="space-y-2">
              {Object.entries(form.opening_hours).map(([day, h]: [string, any]) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium capitalize">{day}</span>
                  <input type="checkbox" checked={h.isOpen} onChange={(e) => updateHour(day, 'isOpen', e.target.checked)} />
                  {h.isOpen && (
                    <>
                      <input type="time" value={h.open} onChange={(e) => updateHour(day, 'open', e.target.value)} className="border border-bordergray rounded-lg px-2 py-1.5 text-sm" />
                      <span className="text-gray-400">–</span>
                      <input type="time" value={h.close} onChange={(e) => updateHour(day, 'close', e.target.value)} className="border border-bordergray rounded-lg px-2 py-1.5 text-sm" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-bordergray rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-1">About Your Practice</h2>
            <p className="text-sm text-gray-500 mb-3">Include your services, specialties, team members, pricing. More detail means better AI performance.</p>
            <textarea rows={5} className="w-full border border-bordergray rounded-lg px-4 py-3 text-sm" value={form.about_text} onChange={(e) => setForm({ ...form, about_text: e.target.value })} />
          </div>

          <div className="border border-bordergray rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-1">Common Questions & Answers</h2>
            <p className="text-sm text-gray-500 mb-4">Add questions your clients frequently ask.</p>
            <div className="space-y-3">
              {form.common_questions.map((qa, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <input placeholder="Question" className="w-full border border-bordergray rounded-lg px-3 py-2 text-sm" value={qa.question} onChange={(e) => updateQuestion(i, 'question', e.target.value)} />
                    <input placeholder="Answer" className="w-full border border-bordergray rounded-lg px-3 py-2 text-sm" value={qa.answer} onChange={(e) => updateQuestion(i, 'answer', e.target.value)} />
                  </div>
                  <button onClick={() => removeQuestion(i)} className="text-gray-400 hover:text-danger"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
            <button onClick={addQuestion} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-gray-600 border border-bordergray rounded-lg px-3 py-2">
              <Plus size={16} /> Add Question
            </button>
          </div>

          <div className="border border-bordergray rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-1">Emergency Keywords</h2>
            <p className="text-sm text-gray-500 mb-4">Calls containing these words will be immediately forwarded.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.emergency_keywords.map((kw) => (
                <span key={kw} className="bg-red-50 text-danger px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                  {kw} <button onClick={() => removeKeyword(kw)}><X size={14} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input placeholder="Add a keyword..." className="flex-1 border border-bordergray rounded-lg px-3 py-2 text-sm" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addKeyword()} />
              <button onClick={addKeyword} className="border border-bordergray rounded-lg px-4"><Plus size={16} /></button>
            </div>
          </div>

          <div className="border border-bordergray rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">Automatic Scammer & Spam Blocking</h2>
              <p className="text-sm text-gray-500">Automatically detect and block known spam numbers and robocalls.</p>
            </div>
            <input type="checkbox" checked={form.scammer_blocking} onChange={(e) => setForm({ ...form, scammer_blocking: e.target.checked })} className="w-5 h-5" />
          </div>

          <div className="border border-bordergray rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">AI Voice & Tone</h2>
            <div className="grid grid-cols-3 gap-3">
              {toneOptions.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setForm({ ...form, ai_tone: t.key })}
                  className={`text-left border-2 rounded-xl p-4 transition ${form.ai_tone === t.key ? 'border-electric' : 'border-bordergray'}`}
                >
                  <p className="font-semibold text-sm mb-2">{t.label}</p>
                  <p className="text-xs text-gray-500 italic">{t.preview}</p>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full bg-electric text-white py-3.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save and Train AI'}
          </button>
          <p className="text-center text-xs text-gray-400">Changes take effect within 5 minutes.</p>
        </div>
      </main>

      {toast && <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm z-50">{toast}</div>}
    </div>
  )
}
