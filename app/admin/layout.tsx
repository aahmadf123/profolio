import type React from "react"
import { AuthProvider } from "@/components/auth-provider"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AuthAwareLogger } from "@/components/auth-aware-logger"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider requireAuth>
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
        <AuthAwareLogger />
      </div>
    </AuthProvider>
  )
}

