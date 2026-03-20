import AdminLoginForm from '@/components/admin/AdminLoginForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Admin Login — East Division' }

export default async function AdminLoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/admin')

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="display-heading text-3xl text-white tracking-wider mb-1">EAST DIVISION</p>
          <p className="text-xs text-white/30 tracking-widest uppercase">Admin Access</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
