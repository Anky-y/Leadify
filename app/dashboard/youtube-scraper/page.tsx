import type { Metadata } from "next"
import { requireAuth } from "@/app/auth"
import YouTubeScraperUI from "@/components/youtube-scraper/youtube-scraper-ui"

export const metadata: Metadata = {
  title: "YouTube Scraper | Leadify",
  description: "Find and filter YouTube creators based on your specific requirements.",
}

export default async function YouTubeScraperPage() {
  const user = await requireAuth()

  return <YouTubeScraperUI initialSubscribed={user.subscribed} />
}
