import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Filter, Globe, RefreshCcw, Search, Mail, Users } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
                  Powerful Features for Content Creator Discovery
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Leadify provides a comprehensive suite of tools to help you find, connect with, and manage
                  relationships with the perfect content creators for your brand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 p-2">
                  <Database className="h-6 w-6 text-blue-700" />
                </div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-blue-900">
                  Advanced Data Collection
                </h2>
                <p className="text-gray-500 md:text-lg/relaxed">
                  Our platform continuously collects and updates data from Twitch, YouTube, and other platforms to
                  ensure you always have access to the most current information about content creators.
                </p>
                <ul className="space-y-2 text-gray-500">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-700">•</span>
                    <span>Real-time data updates for active streamers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-700">•</span>
                    <span>Historical performance metrics to identify growth trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-700">•</span>
                    <span>Comprehensive profile information including contact details and social media</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-purple-100 p-2">
                  <Filter className="h-6 w-6 text-purple-700" />
                </div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-blue-900">
                  Powerful Search & Filtering
                </h2>
                <p className="text-gray-500 md:text-lg/relaxed">
                  Find exactly the right content creators with our advanced search and filtering capabilities, allowing
                  you to narrow down by audience size, engagement rates, content type, and more.
                </p>
                <ul className="space-y-2 text-gray-500">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-700">•</span>
                    <span>Filter by language, viewer count, follower count, and content category</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-700">•</span>
                    <span>Save and organize your searches for future reference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-700">•</span>
                    <span>Identify creators with the highest engagement rates in your niche</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
                More Powerful Features
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Search className="h-5 w-5 text-blue-700" />
                  </div>
                  <CardTitle>Twitch Scraper</CardTitle>
                  <CardDescription>
                    Find and filter Twitch streamers based on your specific requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Access detailed analytics, viewer demographics, and contact information for thousands of Twitch
                    streamers. Export data in multiple formats for easy integration with your existing workflows.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                    <Globe className="h-5 w-5 text-indigo-700" />
                  </div>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Access public contact details to streamline your outreach</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Get access to public email addresses, social media profiles, and other contact information to help
                    you connect with content creators directly and efficiently.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                    <RefreshCcw className="h-5 w-5 text-violet-700" />
                  </div>
                  <CardTitle>Regular Updates</CardTitle>
                  <CardDescription>Always work with the most current creator data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Our database is updated daily to ensure you always have access to the most current information about
                    content creators, their performance metrics, and contact details.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Mail className="h-5 w-5 text-green-700" />
                  </div>
                  <CardTitle>Email Automation</CardTitle>
                  <CardDescription>Streamline your outreach to content creators</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Create personalized email campaigns to connect with streamers and track your outreach efforts.
                    Schedule follow-ups and manage relationships all in one place.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <Users className="h-5 w-5 text-amber-700" />
                  </div>
                  <CardTitle>Team Collaboration</CardTitle>
                  <CardDescription>Work together with your team on creator outreach</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Share saved searches, notes, and outreach history with your team members. Assign tasks and track
                    progress to ensure efficient collaboration on your influencer marketing campaigns.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100">
                    <Database className="h-5 w-5 text-pink-700" />
                  </div>
                  <CardTitle>Data Export</CardTitle>
                  <CardDescription>Export data in multiple formats for easy integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Export your search results in CSV, Excel, or JSON formats for easy integration with your existing
                    tools and workflows. Schedule automated exports for regular reporting.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
