'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import clsx from 'clsx'

const STATUSES = ['pending', 'paid', 'shipped', 'delivered']

export default function UpdateOrderStatus({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={clsx(
              'px-4 py-2 text-xs tracking-widest uppercase border transition-all',
              status === s
                ? 'bg-white text-brand-black border-white font-semibold'
                : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={loading || status === currentStatus}
        className="btn-primary text-sm"
      >
        {saved ? 'Saved ✓' : loading ? 'Saving...' : 'Update Status'}
      </button>
    </div>
  )
}
