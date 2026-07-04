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

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-electriclight text-electric px-5 py-1.5 rounded-full text-sm font-semibold mb-6">
          AI-Powered Phone Employee
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-none">
          Your AI Employee.<br />Answers Every Call.<br />Misses Nothing.
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-9">
          AgentOS gives your practice a dedicated AI employee that answers calls, filters time-wasters, 
          books appointments, and escalates emergencies — 24 hours a day, 7 days a week.
        </p>

        <div className="flex items-center justify-center gap-4 mb-5">
          <Link href="/register" className="btn btn-primary px-9 py-4 text-base">
            Get Started Free
          </Link>
          <a href="#how-it-works" className="btn btn-secondary px-8 py-4 text-base">
            See How It Works
          </a>
        </div>
        <p className="text-sm text-gray-500">14-day money-back guarantee. No setup surprises.</p>
      </section>

      {/* Trust Stats */}
      <section className="bg-sidebargray py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold tracking-tighter">2,400+</div>
              <div className="text-gray-500 mt-1 text-sm">Calls Handled Daily</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold tracking-tighter">91%</div>
              <div className="text-gray-500 mt-1 text-sm">Average Resolution Rate</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold tracking-tighter">8s</div>
              <div className="text-gray-500 mt-1 text-sm">Average Response Time</div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Trusted by medical practices, architecture firms, law offices and engineering companies.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="product" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Phone, title: 'Never Miss a Call', desc: 'Your AI employee answers every call instantly, 24/7. No voicemail. No missed opportunities.' },
            { icon: ShieldCheck, title: 'Filters Time-Wasters', desc: 'AgentOS identifies and blocks spam, robocalls, and time-wasting enquiries automatically.' },
            { icon: Calendar, title: 'Books Appointments', desc: 'Clients book directly during the call. Your calendar fills automatically.' },
          ].map((f, i) => (
            <div key={i} className="card p-8">
              <div className="w-12 h-12 bg-electriclight rounded-2xl flex items-center justify-center mb-6">
                <f.icon className="text-electric" size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-sidebargray py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-14 tracking-tighter">Up and running in 24 hours.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Train Your AI Brain', desc: 'Tell AgentOS about your practice, services, and hours. Takes 10 minutes.' },
              { step: '2', title: 'Forward Your Number', desc: 'Forward your existing number to your AgentOS number. No hardware needed.' },
              { step: '3', title: 'Focus On Your Work', desc: 'Your AI employee handles calls from this moment forward.' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-bordergray">
                <div className="w-9 h-9 bg-electric text-white rounded-2xl flex items-center justify-center font-bold mb-6">
                  {s.step}
                </div>
                <h3 className="font-semibold text-xl mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-3 tracking-tighter">Simple, transparent pricing.</h2>
          <p className="text-gray-500">One-time £499 professional setup included with every plan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Starter',
              price: '89',
              popular: false,
              desc: 'For practices that want to test the waters.',
              features: ['1 AI Phone Employee', 'Up to 150 calls/month', 'Basic AI responses', 'No appointment booking', 'Email support'],
            },
            {
              name: 'Growth',
              price: '279',
              popular: true,
              desc: 'The complete AI employee for growing practices.',
              features: ['3 AI Phone Employees', 'Up to 3,000 calls/month', 'Full AI Brain training', 'Smart call summaries', 'Appointment booking', 'Emergency forwarding', 'Custom branding'],
            },
            {
              name: 'Scale',
              price: '699',
              popular: false,
              desc: 'For high volume practices where every call matters.',
              features: ['8 AI Phone Employees', 'Up to 10,000 calls/month', 'Everything in Growth', 'SMS emergency alerts', 'Full transcripts + AI analysis', 'Priority support'],
            },
          ].map((plan, i) => (
            <div key={i} className={`card p-8 relative ${plan.popular ? 'ring-2 ring-electric' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-electric text-white px-4 py-0.5 text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-2xl font-bold">{plan.name}</div>
              <div className="mt-4 mb-1">
                <span className="text-5xl font-extrabold tracking-tighter">£{plan.price}</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
              
              <Link href={`/register?plan=${plan.name.toLowerCase()}`} className={`w-full btn mb-6 ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                Get Started
              </Link>

              <ul className="space-y-3 text-sm">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="text-emerald-500 mt-0.5 flex-shrink-0" size={17} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">Annual plans available • 14-day money back guarantee</p>
      </section>

      {/* Final CTA */}
      <div className="bg-electric text-white py-16">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-4xl font-extrabold tracking-tighter mb-3">Your AI employee is ready.</h2>
          <p className="text-blue-100 mb-8 text-lg">Stop losing clients to missed calls.</p>
          <Link href="/register" className="inline-block bg-white text-electric px-9 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition">
            Get Started Today
          </Link>
        </div>
      </div>

      <footer className="bg-white py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} AgentOS. Built for practices that never miss a call.
      </footer>
    </div>
  )
}
