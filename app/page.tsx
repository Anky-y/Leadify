import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-blue-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800">
                    Launching Soon: YouTube Scraper
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-blue-900">
                    Find the Perfect Content Creators for Your Brand
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Leadify helps you discover, connect with, and manage
                    relationships with the right content creators to amplify
                    your brand's message.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button className="bg-blue-700 hover:bg-blue-800">
                      Get Started Free
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      See How It Works
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                    <span>Free plan available</span>
                  </div>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur-xl opacity-20 animate-pulse"></div>
                <Image
                  src="/images/leadifybanner.png"
                  width={550}
                  height={300}
                  alt="Leadify Dashboard"
                  className="mx-auto aspect-auto overflow-hidden rounded-xl object-contain object-center relative"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="w-full py-12 md:py-16 border-y bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <p className="text-gray-500 text-sm uppercase font-medium tracking-wider">
                Trusted by marketing teams at
              </p>
              <div className="flex flex-wrap justify-center gap-12 md:gap-12 lg:gap-16">
                <div className="flex items-center justify-center">
                  <div className="h-8 m-4 w-auto text-gray-400 text-xl font-bold">
                    ThreeCloverMedia
                  </div>
                  <div className="h-8 m-4 w-auto text-gray-400 text-xl font-bold">
                    Organix
                  </div>
                  <div className="h-8 m-4 w-auto text-gray-400 text-xl font-bold">
                    Nexus Ai
                  </div>
                  <div className="h-8 m-4 w-auto text-gray-400 text-xl font-bold">
                    Fulfilledge
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  <Star className="mr-1 h-3.5 w-3.5" />
                  <span>Key Benefits</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
                  Why Choose Leadify?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers unique advantages to help you succeed in
                  your influencer marketing campaigns.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <TrendingUp className="h-5 w-5 text-blue-700" />
                  </div>
                  <CardTitle>Data-Driven Decisions</CardTitle>
                  <CardDescription>
                    Make informed choices based on comprehensive analytics and
                    insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Access detailed metrics on content creators, including
                    engagement rates, audience demographics, and performance
                    trends to identify the perfect partners for your brand.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Zap className="h-5 w-5 text-purple-700" />
                  </div>
                  <CardTitle>Time-Saving Automation</CardTitle>
                  <CardDescription>
                    Streamline your workflow with powerful automation tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Automate repetitive tasks like data collection, filtering,
                    and outreach to focus on building meaningful relationships
                    with content creators.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                    <Globe className="h-5 w-5 text-indigo-700" />
                  </div>
                  <CardTitle>Global Reach</CardTitle>
                  <CardDescription>
                    Connect with content creators from around the world
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Discover creators in multiple languages and regions to
                    expand your brand's global presence and connect with diverse
                    audiences.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Users className="h-5 w-5 text-green-700" />
                  </div>
                  <CardTitle>Team Collaboration</CardTitle>
                  <CardDescription>
                    Work together seamlessly with your marketing team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Share saved searches, notes, and outreach history with team
                    members to ensure everyone is aligned and working
                    efficiently.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <Shield className="h-5 w-5 text-amber-700" />
                  </div>
                  <CardTitle>Compliance & Privacy</CardTitle>
                  <CardDescription>
                    Stay compliant with data protection regulations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Our platform is designed with privacy in mind, ensuring that
                    all data collection and processing complies with relevant
                    regulations.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100">
                    <ArrowRight className="h-5 w-5 text-pink-700" />
                  </div>
                  <CardTitle>Seamless Integrations</CardTitle>
                  <CardDescription>
                    Connect with your favorite tools and platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Integrate with popular CRM systems, email marketing
                    platforms, and spreadsheet applications to incorporate
                    Leadify into your existing workflow.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Highlight Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
                    <Star className="mr-1 h-3.5 w-3.5" />
                    <span>Core Features</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">
                    Powerful Tools for Influencer Discovery
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed">
                    Our platform provides everything you need to find, analyze,
                    and connect with the perfect content creators for your
                    brand.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Advanced Search & Filtering
                      </h3>
                      <p className="text-sm text-gray-500">
                        Find creators based on language, follower count, viewer
                        count, content type, and more.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Comprehensive Analytics</h3>
                      <p className="text-sm text-gray-500">
                        Access detailed metrics and insights to make data-driven
                        decisions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Contact Information Access
                      </h3>
                      <p className="text-sm text-gray-500">
                        Get public contact details and social media profiles to
                        streamline your outreach.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Data Export & Integration</h3>
                      <p className="text-sm text-gray-500">
                        Export data in multiple formats and integrate with your
                        existing tools.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <Link href="/features">
                    <Button className="bg-blue-700 hover:bg-blue-800">
                      Explore All Features
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur-xl opacity-20"></div>
                <div className="relative bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-sm font-medium text-gray-500">
                        Twitch Scraper
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-100 rounded w-3/4"></div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-24 bg-gray-100 rounded"></div>
                        <div className="h-24 bg-gray-100 rounded"></div>
                        <div className="h-24 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-40 bg-gray-100 rounded"></div>
                      <div className="flex justify-end">
                        <div className="h-8 bg-blue-100 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  <Star className="mr-1 h-3.5 w-3.5" />
                  <span>Testimonials</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
                  What Our Customers Say
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't just take our word for it. Here's what marketing
                  professionals have to say about Leadify.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <span className="font-medium text-gray-900">JD</span>
                    </div>
                    <div>
                      <div className="font-medium">Jane Doe</div>
                      <div className="text-sm text-gray-500">
                        Marketing Director, TechCorp
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <blockquote className="mt-4 text-gray-500">
                    "Leadify has transformed our influencer marketing strategy.
                    We've been able to find creators who truly align with our
                    brand values, resulting in more authentic partnerships and
                    higher ROI."
                  </blockquote>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <span className="font-medium text-gray-900">MS</span>
                    </div>
                    <div>
                      <div className="font-medium">Michael Smith</div>
                      <div className="text-sm text-gray-500">
                        Growth Lead, StartupX
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <blockquote className="mt-4 text-gray-500">
                    "The time we save using Leadify is incredible. What used to
                    take days of manual research now takes minutes. The advanced
                    filtering options help us pinpoint exactly the type of
                    creators we need."
                  </blockquote>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <span className="font-medium text-gray-900">SJ</span>
                    </div>
                    <div>
                      <div className="font-medium">Sarah Johnson</div>
                      <div className="text-sm text-gray-500">
                        CMO, GlobalBrand
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <blockquote className="mt-4 text-gray-500">
                    "As a global brand, we needed a solution that could help us
                    find creators in multiple markets and languages. Leadify
                    delivers exactly that, with reliable data and excellent
                    support."
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
                  Ready to Transform Your Influencer Marketing?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for your business needs. All
                  plans include access to our core features.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button className="bg-blue-700 hover:bg-blue-800">
                    Get Started Free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
