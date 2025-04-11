import Header from "@/components/header"
import Footer from "@/components/footer"
import TwitchScraperUI from "@/components/twitch-scraper/twitch-scraper-ui"

export default function TwitchScraperPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <TwitchScraperUI />
      </main>
      <Footer />
    </div>
  )
}
