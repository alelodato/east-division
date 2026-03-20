'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteProductButton({ productId, productName }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    }
    setLoading(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          {loading ? '...' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-white/30 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
      title={`Delete ${productName}`}
    >
      <Trash2 size={14} />
    </button>
  )
}
