import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}