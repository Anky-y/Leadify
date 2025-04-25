import type { Metadata } from "next"
import CrmUI from "@/components/crm/crm-ui"
import { useUser } from "@/app/context/UserContext"

export const metadata: Metadata = {
  title: "CRM | Leadify",
  description: "Manage your leads and email sequences.",
}

export default async function CrmPage() {
  const {user} = useUser()

  return <CrmUI initialSubscribed={user?.is_subscribed} />
}
