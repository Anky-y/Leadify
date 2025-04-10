import { Filter, Mail, Search, Users } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">How It Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find and connect with the perfect content creators in just a few simple steps
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-2 border border-blue-100 rounded-lg p-4 relative">
            <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white font-bold">
              1
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-8 w-8 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold">Sign Up</h3>
            <p className="text-center text-gray-500 text-sm">
              Create your account and select a subscription plan that fits your needs
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-blue-100 rounded-lg p-4 relative">
            <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white font-bold">
              2
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <Filter className="h-8 w-8 text-indigo-700" />
            </div>
            <h3 className="text-xl font-bold">Set Filters</h3>
            <p className="text-center text-gray-500 text-sm">
              Define your criteria to find streamers that match your brand requirements
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-blue-100 rounded-lg p-4 relative">
            <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white font-bold">
              3
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
              <Search className="h-8 w-8 text-violet-700" />
            </div>
            <h3 className="text-xl font-bold">Browse Results</h3>
            <p className="text-center text-gray-500 text-sm">
              Review detailed profiles and analytics for each streamer in your results
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-blue-100 rounded-lg p-4 relative">
            <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white font-bold">
              4
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-8 w-8 text-green-700" />
            </div>
            <h3 className="text-xl font-bold">Connect</h3>
            <p className="text-center text-gray-500 text-sm">
              Export data or use contact information to reach out to your selected streamers
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
