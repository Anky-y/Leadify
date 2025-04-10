import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
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
                  Simple, Transparent Pricing
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for your business needs. All plans include access to our core
                  features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Free Plan */}
              <Card className="flex flex-col border-blue-100">
                <CardHeader>
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <CardDescription>Perfect for exploring the platform</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Limited access to Twitch streamer database</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Basic search functionality</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>10 search results per query</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Weekly database updates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Community support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">Sign Up Free</Button>
                </CardFooter>
              </Card>

              {/* Basic Plan */}
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
                      <span>Full access to Twitch streamer database</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Advanced filtering options</span>
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
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>5 saved searches</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Premium Plan */}
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
                      <span>Unlimited search results</span>
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
                      <span>Unlimited saved searches</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Full contact information access</span>
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

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mx-auto grid max-w-3xl gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-700" />
                    <CardTitle className="text-lg">Can I upgrade or downgrade my plan at any time?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will be
                    reflected in your next billing cycle.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-700" />
                    <CardTitle className="text-lg">Do you offer annual billing?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Yes, we offer annual billing with a 20% discount compared to monthly billing. Contact our sales team
                    for more information.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-700" />
                    <CardTitle className="text-lg">Is there a free trial available?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    We offer a 14-day free trial of our Premium plan for new users. No credit card required to start
                    your trial.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
                  Ready to Get Started?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sign up today and start discovering the perfect content creators for your brand.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-blue-700 hover:bg-blue-800">Sign Up Now</Button>
                <Link href="/contact">
                  <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
