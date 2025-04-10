import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Mail, Search } from "lucide-react"

export default function Services() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">Our Services</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Comprehensive tools to help you find and connect with the right content creators
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          <Card className="relative overflow-hidden border-blue-100">
            <CardHeader>
              <Badge className="absolute right-4 top-4 bg-green-500 hover:bg-green-600">AVAILABLE NOW</Badge>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Database className="h-6 w-6 text-blue-700" />
              </div>
              <CardTitle className="text-xl">Twitch Scraper</CardTitle>
              <CardDescription>Find and filter Twitch streamers based on your specific requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Access detailed analytics, viewer demographics, and contact information for thousands of Twitch
                streamers.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-700 hover:bg-blue-800">Explore Now</Button>
            </CardFooter>
          </Card>
          <Card className="relative overflow-hidden border-blue-100">
            <CardHeader>
              <Badge className="absolute right-4 top-4 bg-amber-500 hover:bg-amber-600">COMING SOON</Badge>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Search className="h-6 w-6 text-purple-700" />
              </div>
              <CardTitle className="text-xl">YouTube Scraper</CardTitle>
              <CardDescription>Discover YouTube creators that align with your brand values</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Find YouTube creators based on content type, subscriber count, engagement rates, and more.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                Join Waitlist
              </Button>
            </CardFooter>
          </Card>
          <Card className="relative overflow-hidden border-blue-100">
            <CardHeader>
              <Badge className="absolute right-4 top-4 bg-amber-500 hover:bg-amber-600">COMING SOON</Badge>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <Mail className="h-6 w-6 text-indigo-700" />
              </div>
              <CardTitle className="text-xl">Email Automation</CardTitle>
              <CardDescription>Streamline your outreach to content creators</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Create personalized email campaigns to connect with streamers and track your outreach efforts.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                Join Waitlist
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
