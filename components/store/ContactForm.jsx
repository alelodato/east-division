'use client'

import { useState } from 'react'

const SUBJECTS = [
  'Order Query',
  'Return / Refund',
  'Product Enquiry',
  'Wholesale',
  'Press & Media',
  'Other',
]

export default function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          ...formData,
          from_name: 'East Division Contact',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-zinc-900 p-8 text-center">
        <p className="display-heading text-3xl text-brand-accent mb-3">MESSAGE SENT</p>
        <p className="text-white/50 text-sm">
          Thanks for reaching out. We&apos;ll be in touch within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors"
        >
          Send Another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="section-label mb-2 block">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="section-label mb-2 block">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="section-label mb-2 block">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-colors"
        >
          <option value="" disabled>Select a subject</option>
          {SUBJECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="section-label mb-2 block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-colors resize-none placeholder:text-white/20"
          placeholder="How can we help?"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full justify-center"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-400 text-center">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  )
}
