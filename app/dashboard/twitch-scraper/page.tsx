import type { Metadata } from "next"
import { requireAuth } from "@/app/auth"
import TwitchScraperUI from "@/components/twitch-scraper/twitch-scraper-ui"

export const metadata: Metadata = {
  title: "Twitch Scraper | Leadify",
  description: "Find and filter Twitch streamers based on your specific requirements.",
}

export default async function TwitchScraperPage() {
  const user = await requireAuth()

  return <TwitchScraperUI initialSubscribed={user.subscribed} />
}
