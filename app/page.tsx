import Header from "@/components/header"
import Hero from "@/components/sections/hero"
import Services from "@/components/sections/services"
import Features from "@/components/sections/features"
import HowItWorks from "@/components/sections/how-it-works"
import Pricing from "@/components/sections/pricing"
import CTA from "@/components/sections/cta"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
