import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
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
                  Get in Touch
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions about our platform? Want to learn more about how Leadify can help your business? We're
                  here to help.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-blue-900 mb-6">
                  Send Us a Message
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <form className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input id="first-name" placeholder="Enter your first name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input id="last-name" placeholder="Enter your last name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" placeholder="Enter your company name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Enter your message" className="min-h-[120px] resize-y" />
                      </div>
                      <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-blue-900 mb-6">
                  Contact Information
                </h2>
                <div className="grid gap-6">
                  <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <Mail className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Email Us</h3>
                        <p className="text-gray-500 mt-1">Our friendly team is here to help.</p>
                        <a href="mailto:hello@leadify.com" className="text-blue-700 hover:underline mt-2 block">
                          hello@leadify.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                        <Phone className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Call Us</h3>
                        <p className="text-gray-500 mt-1">Mon-Fri from 8am to 5pm.</p>
                        <a href="tel:+1-555-123-4567" className="text-blue-700 hover:underline mt-2 block">
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                        <MapPin className="h-5 w-5 text-indigo-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Visit Us</h3>
                        <p className="text-gray-500 mt-1">Come say hello at our office.</p>
                        <address className="not-italic text-gray-500 mt-2">
                          123 Market Street
                          <br />
                          Suite 456
                          <br />
                          San Francisco, CA 94103
                        </address>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQ Link */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
                  <p className="text-gray-500">
                    Find quick answers to common questions in our{" "}
                    <a href="/faq" className="text-blue-700 hover:underline">
                      FAQ section
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-blue-900">Our Location</h2>
            </div>
            <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200">
              <div className="aspect-[16/9] w-full bg-gray-100">
                {/* Placeholder for map - in a real app, you would embed a Google Map or similar here */}
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">Map loading...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
