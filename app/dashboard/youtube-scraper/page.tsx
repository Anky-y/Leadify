import type { Metadata } from "next"
import YouTubeScraperUI from "@/components/youtube-scraper/youtube-scraper-ui"
import { useUser } from "@/app/context/UserContext"

export const metadata: Metadata = {
  title: "YouTube Scraper | Leadify",
  description: "Find and filter YouTube creators based on your specific requirements.",
}

export default async function YouTubeScraperPage() {
  const {user} = useUser()

  return <YouTubeScraperUI initialSubscribed={user?.is_subscribed} />
}
