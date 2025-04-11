import type { Metadata } from "next"
import { requireAuth } from "@/app/auth"
import EmailAutomationUI from "@/components/email-automation/email-automation-ui"

export const metadata: Metadata = {
  title: "Email Automation | Leadify",
  description: "Create and manage email sequences for your leads.",
}

export default async function EmailAutomationPage() {
  const user = await requireAuth()

  return <EmailAutomationUI initialSubscribed={user.subscribed} />
}
