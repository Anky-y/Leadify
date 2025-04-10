import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-blue-900">
                Discover the Perfect Streamers for Your Brand
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Connect with the right content creators to amplify your brand's message and reach your target audience
                effectively.
              </p>
              <div className="pt-4 text-blue-600 font-medium">SIMPLIFYING OUTREACH • AMPLIFYING RESULTS</div>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-blue-700 hover:bg-blue-800">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Learn More
              </Button>
            </div>
          </div>
          <div className="mx-auto lg:mx-0 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur-xl opacity-20 animate-pulse"></div>
            <Image
              src="/images/leadifybanner.png"
              width={550}
              height={300}
              alt="Leadify"
              className="mx-auto aspect-auto overflow-hidden rounded-xl object-contain object-center relative"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
