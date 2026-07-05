'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from '@/components/Sidebar'
import { Plus, Trash2, Save } from 'lucide-react'

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

    return `You are the AI receptionist for ${form.practice_name || '[Business Name]'}, a ${form.practice_type} located at ${form.address || '[Address]'}.

Your opening hours are:
${hoursText}

About this practice: ${form.about_text || '[Not provided]'}

Common questions and answers:
${qaText || '[None added yet]'}

Emergency protocol: If the caller mentions any of the following words — ${form.emergency_keywords.join(', ')} — immediately say "I am connecting you to someone urgently, please hold" and transfer the call to ${form.emergency_phone || '[Emergency Number]'}.

Scammer detection: ${form.scammer_blocking ? 'Be alert for robocalls, spam, and irrelevant calls. Politely end calls that appear automated or time-wasting.' : 'Disabled.'}

Your tone should be ${form.ai_tone.replace('_', ' ')}. Always be professional, helpful and represent the practice with excellence.`
  }

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)

    const system_prompt = generatePrompt()

    const { data: existing } = await supabase
      .from('ai_brain')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    const payload = { ...form, system_prompt, updated_at: new Date().toISOString() }

    if (existing) {
      await supabase.from('ai_brain').update(payload).eq('user_id', userId)
    } else {
      await supabase.from('ai_brain').insert({ ...payload, user_id: userId })
    }

    setSaving(false)
    setToast('AI Brain saved successfully! Changes will apply within 5 minutes.')
    setTimeout(() => setToast(''), 4000)
  }

  const updateHour = (day: string, field: string, value: any) => {
    setForm({
      ...form,
      opening_hours: {
        ...form.opening_hours,
        [day]: { ...form.opening_hours[day], [field]: value },
      },
    })
  }

  const addQuestion = () => {
    setForm({ ...form, common_questions: [...form.common_questions, { question: '', answer: '' }] })
  }

  const removeQuestion = (i: number) => {
    setForm({ ...form, common_questions: form.common_questions.filter((_, idx) => idx !== i) })
  }

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

  const removeKeyword = (kw: string) => {
    setForm({ ...form, emergency_keywords: form.emergency_keywords.filter((k) => k !== kw) })
  }

  const toneOptions = [
    { key: 'professional', label: 'Professional' },
    { key: 'friendly_professional', label: 'Friendly Professional' },
    { key: 'warm_approachable', label: 'Warm & Approachable' },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">AI Brain</h1>
            <p className="text-gray-500">Train your AI employees to represent your practice perfectly.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex items-center gap-2 px-6 disabled:opacity-70"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save AI Brain'}
          </button>
        </div>

        {/* Practice Info */}
        <div className="card p-7 mb-8">
          <h2 className="font-semibold text-lg mb-5">Practice Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Practice Name</label>
              <input
                value={form.practice_name}
                onChange={(e) => setForm({ ...form, practice_name: e.target.value })}
                className="w-full border border-bordergray rounded-2xl px-4 py-3 text-sm"
                placeholder="City Medical Practice"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Practice Type</label>
              <select
                value={form.practice_type}
                onChange={(e) => setForm({ ...form, practice_type: e.target.value })}
                className="w-full border border-bordergray rounded-2xl px-4 py-3 text-sm"
              >
                <option>Medical Practice</option>
                <option>Dental Practice</option>
                <option>Architecture Firm</option>
                <option>Engineering Firm</option>
                <option>Law Office</option>
                <option>Consulting Firm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-bordergray rounded-2xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Main Phone</label>
              <input value={form.main_phone} onChange={(e) => setForm({ ...form, main_phone: e.target.value })} className="w-full border border-bordergray rounded-2xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Emergency Phone</label>
              <input value={form.emergency_phone} onChange={(e) => setForm({ ...form, emergency_phone: e.target.value })} className="w-full border border-bordergray rounded-2xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Website</label>
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full border border-bordergray rounded-2xl px-4 py-3 text-sm" />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="card p-7 mb-8">
          <h2 className="font-semibold text-lg mb-4">Opening Hours</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
            {Object.entries(form.opening_hours).map(([day, h]: [string, any]) => (
              <div key={day} className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium capitalize">{day}</label>
                <input type="checkbox" checked={h.isOpen} onChange={(e) => updateHour(day, 'isOpen', e.target.checked)} className="accent-electric" />
                {h.isOpen && (
                  <>
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => updateHour(day, 'open', e.target.value)}
                      className="border border-bordergray rounded-xl px-3 py-2 text-sm"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => updateHour(day, 'close', e.target.value)}
                      className="border border-bordergray rounded-xl px-3 py-2 text-sm"
                    />
                  </>
                )}
                {!h.isOpen && <span className="text-xs text-gray-400">Closed</span>}
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="card p-7 mb-8">
          <h2 className="font-semibold text-lg mb-4">About Your Practice</h2>
          <textarea
            value={form.about_text}
            onChange={(e) => setForm({ ...form, about_text: e.target.value })}
            rows={5}
            className="w-full border border-bordergray rounded-2xl p-4 text-sm resize-y"
            placeholder="We are a friendly GP practice serving 6,200 patients. We offer same-day appointments, minor surgery, and chronic disease management..."
          />
          <p className="text-xs text-gray-500 mt-1.5">The more detail you provide, the better your AI will perform.</p>
        </div>

        {/* Common Questions */}
        <div className="card p-7 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Common Questions &amp; Answers</h2>
            <button onClick={addQuestion} className="text-sm flex items-center gap-1 text-electric font-medium">
              <Plus size={16} /> Add Q&amp;A
            </button>
          </div>
          {form.common_questions.map((qa, i) => (
            <div key={i} className="flex gap-3 mb-3 items-start">
              <div className="flex-1 space-y-2">
                <input
                  placeholder="What is your question?"
                  value={qa.question}
                  onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                  className="w-full border border-bordergray rounded-2xl px-4 py-2.5 text-sm"
                />
                <input
                  placeholder="What should the AI answer?"
                  value={qa.answer}
                  onChange={(e) => updateQuestion(i, 'answer', e.target.value)}
                  className="w-full border border-bordergray rounded-2xl px-4 py-2.5 text-sm"
                />
              </div>
              <button onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-600 mt-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Keywords */}
        <div className="card p-7 mb-8">
          <h2 className="font-semibold text-lg mb-3">Emergency Keywords</h2>
          <div className="flex gap-2 flex-wrap mb-3">
            {form.emergency_keywords.map((kw) => (
              <span key={kw} onClick={() => removeKeyword(kw)} className="px-3 py-1 bg-red-50 text-red-700 text-xs rounded-full flex items-center gap-1 cursor-pointer hover:bg-red-100">
                {kw} ×
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Add new keyword (e.g. heart attack)"
              className="flex-1 border border-bordergray rounded-2xl px-4 py-2 text-sm"
            />
            <button onClick={addKeyword} className="btn btn-secondary px-5">Add</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">If any of these are mentioned, the call is immediately forwarded to the emergency number.</p>
        </div>

        {/* Tone */}
        <div className="card p-7 mb-8">
          <h2 className="font-semibold text-lg mb-4">AI Tone</h2>
          <div className="flex gap-3 flex-wrap">
            {toneOptions.map((t) => (
              <button
                key={t.key}
                onClick={() => setForm({ ...form, ai_tone: t.key })}
                className={`px-5 py-2 rounded-2xl border text-sm ${form.ai_tone === t.key ? 'bg-electriclight border-electric text-electric' : 'border-bordergray'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleSave} disabled={saving} className="btn btn-primary px-8">
            {saving ? 'Saving...' : 'Save AI Brain'}
          </button>
          <div className="text-xs text-gray-500">Changes sync to your AI within ~5 minutes</div>
        </div>

        {toast && <div className="text-green-600 text-sm font-medium">{toast}</div>}
      </main>
    </div>
  )
}
