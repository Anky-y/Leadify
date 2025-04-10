import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that works best for your business needs
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
          <Card className="flex flex-col border-blue-100">
            <CardHeader>
              <CardTitle className="text-2xl">Basic</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-gray-500">/month</span>
              </div>
              <CardDescription>Perfect for small businesses and startups</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Access to Twitch streamer database</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Basic filtering options</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Export up to 100 profiles per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Weekly database updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-700 hover:bg-blue-800">Get Started</Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <Badge className="bg-blue-700 hover:bg-blue-800">POPULAR</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <CardDescription>For businesses serious about creator partnerships</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Advanced filtering options</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unlimited exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Daily database updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Early access to new features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>API access</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-700 hover:bg-blue-800">Get Started</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
