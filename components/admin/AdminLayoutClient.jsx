'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default function AdminLayoutClient({ children }) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/admin/login'

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen bg-zinc-950">
            <AdminSidebar />
            <main className="flex-1 ml-0 lg:ml-64 p-6 lg:p-8">{children}</main>
        </div>
    )
}