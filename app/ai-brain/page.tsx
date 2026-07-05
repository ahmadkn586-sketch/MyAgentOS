'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function AIBrainPage() {
  const [form, setForm] = useState({
    practice_name: 'City Medical Practice',
    about_text: '',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-72 p-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">AI Brain</h1>
        <p className="text-gray-500 mb-8">Train your AI receptionist.</p>

        <div className="card p-8 max-w-2xl">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1.5">Practice Name</label>
            <input
              value={form.practice_name}
              onChange={(e) => setForm({ ...form, practice_name: e.target.value })}
              className="w-full border border-bordergray rounded-2xl px-4 py-3"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1.5">About Your Practice</label>
            <textarea
              value={form.about_text}
              onChange={(e) => setForm({ ...form, about_text: e.target.value })}
              className="w-full border border-bordergray rounded-2xl px-4 py-3 h-32"
              placeholder="We are a friendly medical practice serving over 6,000 patients..."
            />
          </div>

          <button onClick={handleSave} className="btn btn-primary px-8">
            Save AI Brain
          </button>

          {saved && (
            <p className="text-green-600 mt-4 font-medium">✓ Saved successfully. Your AI will update shortly.</p>
          )}
        </div>
      </main>
    </div>
  )
}
