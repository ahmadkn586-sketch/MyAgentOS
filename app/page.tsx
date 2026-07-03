import Link from 'next/link'
import { Phone, ShieldCheck, Calendar, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-bordergray">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-electric rounded-lg"></div>
            <span className="font-bold text-xl">AgentOS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#product">Product</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-700">Login</Link>
            <Link href="/register" className="bg-electric text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block bg-electriclight text-electric px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          AI-Powered Phone Employee
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Your AI Employee.<br />Answers Every Call. Misses Nothing.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          AgentOS gives your practice a dedicated AI employee that answers calls, filters
          time-wasters, books appointments, and escalates emergencies — 24 hours a day, 7 days a week.
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Link href="/register" className="bg-electric text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Get Started
          </Link>
          <a href="#how-it-works" className="border border-bordergray px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition">
            See How It Works
          </a>
        </div>
        <p className="text-sm text-gray-500">14-day money back guarantee. No setup surprises.</p>
      </section>

      <section className="bg-sidebargray py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-8">
            Trusted by medical practices, architecture firms, law offices and engineering companies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-extrabold">2,400+</p>
              <p className="text-gray-500 text-sm">Calls Handled Daily</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">91%</p>
              <p className="text-gray-500 text-sm">Average Resolution Rate</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">8s</p>
              <p className="text-gray-500 text-sm">Average Response Time</p>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Phone, title: 'Never Miss a Call', desc: 'Your AI employee answers every call instantly, 24/7. No voicemail. No missed opportunities.' },
            { icon: ShieldCheck, title: 'Filters Time-Wasters', desc: 'AgentOS identifies and blocks spam, robocalls, and time-wasting enquiries automatically.' },
            { icon: Calendar, title: 'Books Appointments', desc: 'Clients book directly during the call. Your calendar fills automatically.' },
          ].map((f, i) => (
            <div key={i} className="border border-bordergray rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-electriclight rounded-xl flex items-center justify-center mb-4">
                <f.icon className="text-electric" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-sidebargray py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-12">Up and running in 24 hours.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Train Your AI Brain', desc: 'Tell AgentOS about your practice, services, and hours. Takes 10 minutes.' },
              { step: '2', title: 'Forward Your Number', desc: 'Forward your existing number to your AgentOS number. No hardware needed.' },
              { step: '3', title: 'Focus On Your Work', desc: 'Your AI employee handles calls from this moment forward.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-electric text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold mb-2">Simple, transparent pricing.</h2>
          <p className="text-gray-600">One-time £499 professional setup included with every plan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="border border-bordergray rounded-2xl p-8">
            <h3 className="font-bold text-lg mb-1">Starter</h3>
            <p className="text-gray-500 text-sm mb-6">For practices that want to test the waters.</p>
            <p className="text-4xl font-extrabold mb-6">£89<span className="text-base font-medium text-gray-500">/mo</span></p>
            <ul className="space-y-3 text-sm mb-8">
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> 1 AI Phone Employee</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> <span>Up to 150 calls/month<br/><span className="text-gray-400 text-xs">roughly 5 calls per day. After that your AI stops answering.</span></span></li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Basic AI responses only</li>
              <li className="flex gap-2 text-gray-400"><Check size={18} className="shrink-0" /> No appointment booking</li>
              <li className="flex gap-2 text-gray-400"><Check size={18} className="shrink-0" /> No emergency forwarding</li>
            </ul>
            <Link href="/register?plan=starter" className="block text-center border border-bordergray py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
              Get Started
            </Link>
          </div>

          <div className="border-2 border-electric rounded-2xl p-8 relative shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-4 py-1 rounded-full">
              Most Popular
            </span>
            <h3 className="font-bold text-lg mb-1">Growth</h3>
            <p className="text-gray-500 text-sm mb-6">The complete AI employee for growing practices.</p>
            <p className="text-4xl font-extrabold mb-6">£279<span className="text-base font-medium text-gray-500">/mo</span></p>
            <ul className="space-y-3 text-sm mb-8">
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> 3 AI Phone Employees</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Up to 3,000 calls/month</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Full AI Brain training</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Smart call summaries</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Appointment booking automated</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Emergency call forwarding</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Custom branding</li>
            </ul>
            <Link href="/register?plan=growth" className="block text-center bg-electric text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Get Started
            </Link>
          </div>

          <div className="border border-gray-800 rounded-2xl p-8">
            <span className="inline-block bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              For Established Practices
            </span>
            <h3 className="font-bold text-lg mb-1">Scale</h3>
            <p className="text-gray-500 text-sm mb-6">For high volume practices where every call matters.</p>
            <p className="text-4xl font-extrabold mb-6">£699<span className="text-base font-medium text-gray-500">/mo</span></p>
            <ul className="space-y-3 text-sm mb-8">
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> 8 AI Phone Employees</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Up to 10,000 calls/month</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Everything in Growth</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> SMS emergency alerts</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Full transcripts with AI analysis</li>
              <li className="flex gap-2"><Check size={18} className="text-success shrink-0" /> Same day priority support</li>
            </ul>
            <Link href="/register?plan=scale" className="block text-center bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
              Get Started
            </Link>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-sm font-medium">14-day money back guarantee. No questions asked.</p>
          <p className="text-xs text-gray-500 mt-1">
            Annual plans paid upfront. Monthly plans billed same date each month. Pricing includes all AI infrastructure costs. No hidden fees.
          </p>
        </div>
      </section>

      <section className="bg-electric py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Your AI employee is ready.</h2>
          <p className="text-indigo-100 mb-8">Stop losing clients to missed calls.</p>
          <Link href="/register" className="inline-block bg-white text-electric px-8 py-3.5 rounded-lg font-semibold">
            Get Started Today
          </Link>
        </div>
      </section>

      <footer className="border-t border-bordergray py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <span className="font-bold text-gray-900">AgentOS</span>
          <span>© 2026 AgentOS. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
