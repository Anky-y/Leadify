import type { Metadata } from "next"
import TwitchScraperUI from "@/components/twitch-scraper/twitch-scraper-ui"

export const metadata: Metadata = {
  title: "Twitch Scraper | Leadify",
  description: "Find and filter Twitch streamers based on your specific requirements.",
}

export default async function TwitchScraperPage() {

  return <TwitchScraperUI />
}
