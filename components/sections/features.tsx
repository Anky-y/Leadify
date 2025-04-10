import { Database, Filter, Globe, RefreshCcw } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
              Powerful Features
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to find and connect with the perfect content creators
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
          <div className="grid gap-6">
            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <Filter className="h-5 w-5 text-purple-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Advanced Filtering</h3>
                <p className="text-gray-500">
                  Filter streamers by language, viewer count, follower count, content type, and more to find the perfect
                  match.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <Database className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Export Data</h3>
                <p className="text-gray-500">
                  Export and download streamer data in CSV or Excel format for easy integration with your existing
                  workflows.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                <Globe className="h-5 w-5 text-indigo-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Contact Information</h3>
                <p className="text-gray-500">
                  Access public contact information and social media profiles to streamline your outreach process.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                <RefreshCcw className="h-5 w-5 text-violet-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Regular Updates</h3>
                <p className="text-gray-500">
                  Our database is updated daily to ensure you always have access to the most current information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
