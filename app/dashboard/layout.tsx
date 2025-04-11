import type React from "react"
import type { Metadata } from "next"
import { requireAuth } from "@/app/auth"
import DashboardSidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"

export const metadata: Metadata = {
  title: "Dashboard | Leadify",
  description: "Manage your Leadify account and access your tools.",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to login if user is not authenticated
  const user = await requireAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="flex-1 flex">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
