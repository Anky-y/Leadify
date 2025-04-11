import type { Metadata } from "next"
import { requireAuth } from "@/app/auth"
import CrmUI from "@/components/crm/crm-ui"

export const metadata: Metadata = {
  title: "CRM | Leadify",
  description: "Manage your leads and email sequences.",
}

export default async function CrmPage() {
  const user = await requireAuth()

  return <CrmUI initialSubscribed={user.subscribed} />
}
