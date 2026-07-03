import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AgentOS - Your AI Employee. Answers Every Call.',
  description: 'AgentOS gives your practice a dedicated AI employee that answers calls, books appointments, and escalates emergencies 24/7.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
