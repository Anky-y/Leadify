import type { Metadata } from "next"
import { requireAuth } from "@/app/auth"
import EmailSequencesUI from "@/components/email-sequences/email-sequences-ui"

export const metadata: Metadata = {
  title: "Email Sequences | Leadify",
  description: "Create and manage email sequences for your leads.",
}

export default async function EmailSequencesPage() {
  const user = await requireAuth()

  return <EmailSequencesUI initialSubscribed={user.subscribed} />
}
