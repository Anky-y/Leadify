import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, HelpCircle, Zap, Users, Star, X } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 animate-bounce-subtle">
                  Hybrid Pricing Model
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-900">
                  Simple, Flexible Pricing
                </h1>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Pay only for what you use with our credit-based system. Choose a subscription plan that fits your
                  needs and top up credits as you grow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Credit Costs Section */}
        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Credit-Based Actions</h2>
              <p className="text-gray-600">Simple, transparent pricing for every action</p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
              <Card className="text-center border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Streamer Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">1 Credit</div>
                  <p className="text-sm text-gray-500">Per search query</p>
                </CardContent>
              </Card>

              <Card className="text-center border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Reveal Social Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">1 Credit</div>
                  <p className="text-sm text-gray-500">Per profile revealed</p>
                </CardContent>
              </Card>

              <Card className="text-center border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Reveal Email Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">2 Credits</div>
                  <p className="text-sm text-gray-500">Per email revealed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscription Plans</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get monthly credits included with your plan, plus access to premium features
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              {/* Free Plan */}
              <Card className="flex flex-col border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">Free</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 my-4">
                    <span className="text-4xl font-bold text-gray-900">$0</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <CardDescription>Perfect for first-time users testing the platform</CardDescription>
                  <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <div className="text-sm text-blue-700 font-medium">25 Credits (One-time signup bonus)</div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Reveal Social Links</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>CSV Export</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>All sorting (except Email)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Save Search Filters</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Create Custom Folders</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-400">
                      <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span>Email reveals</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-400">
                      <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span>Favoriting Streamers</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 transition-colors">Get Started Free</Button>
                </CardFooter>
              </Card>

              {/* Basic Plan */}
              <Card className="flex flex-col border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">Basic</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 my-4">
                    <span className="text-4xl font-bold text-gray-900">$19</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <CardDescription>Ideal for indie creators and startups</CardDescription>
                  <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <div className="text-sm text-blue-700 font-medium">150 Credits/month</div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Everything in Free</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Reveal Email Addresses</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>JSON Export</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Email Sorting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Favoriting Streamers</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Extra Credit Purchase</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">Start Basic Plan</Button>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="flex flex-col border-purple-200 bg-gradient-to-b from-purple-50 to-white hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1">MOST POPULAR</Badge>
                </div>
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl text-gray-900">Pro</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 my-4">
                    <span className="text-4xl font-bold text-gray-900">$49</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <CardDescription>Perfect for agencies and power users</CardDescription>
                  <div className="bg-purple-50 rounded-lg p-3 mt-4">
                    <div className="text-sm text-purple-700 font-medium">500 Credits/month</div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Excel Export</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Export Selected Columns Only</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Priority Support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Advanced Analytics</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-colors">Start Pro Plan</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Credit Top-Up Packs */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Credit Top-Up Packs</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Need more credits? Purchase additional credits at any time, regardless of your subscription plan
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Starter Pack</CardTitle>
                  <div className="text-2xl font-bold text-blue-600 mt-2">100 Credits</div>
                  <div className="text-3xl font-bold text-gray-900 mt-1">$5</div>
                  <div className="text-sm text-gray-500">$0.05 per credit</div>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    Purchase
                  </Button>
                </CardFooter>
              </Card>

              <Card className="text-center border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Growth Pack</CardTitle>
                  <div className="text-2xl font-bold text-green-600 mt-2">500 Credits</div>
                  <div className="text-3xl font-bold text-gray-900 mt-1">$20</div>
                  <div className="text-sm text-gray-500">$0.04 per credit</div>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    Purchase
                  </Button>
                </CardFooter>
              </Card>

              <Card className="text-center border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Scale Pack</CardTitle>
                  <div className="text-2xl font-bold text-purple-600 mt-2">1,000 Credits</div>
                  <div className="text-3xl font-bold text-gray-900 mt-1">$35</div>
                  <div className="text-sm text-gray-500">$0.035 per credit</div>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                  >
                    Purchase
                  </Button>
                </CardFooter>
              </Card>

              <Card className="text-center border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative">
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-orange-500 text-white text-xs">BEST VALUE</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Power Pack</CardTitle>
                  <div className="text-2xl font-bold text-orange-600 mt-2">5,000 Credits</div>
                  <div className="text-3xl font-bold text-gray-900 mt-1">$150</div>
                  <div className="text-sm text-gray-500">$0.03 per credit</div>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    Purchase
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mx-auto grid max-w-3xl gap-6">
              <Card className="border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">How do credits work?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Credits are used for specific actions like searching streamers, revealing social links, or email
                    addresses. You can use credits as long as you have them - there are no hard limits on usage.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Can I buy credits without a subscription?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes! You can purchase credit top-up packs at any time, regardless of your subscription tier. This
                    gives you complete flexibility to scale your usage as needed.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Do credits expire?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    No, credits never expire. Whether they come from your monthly subscription or from top-up packs, you
                    can use them whenever you need them.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes, you can change your subscription plan at any time. Changes will be reflected in your next
                    billing cycle, and you'll keep all unused credits from your previous plan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
      </main>
      <Footer />
    </div>
  )
}
