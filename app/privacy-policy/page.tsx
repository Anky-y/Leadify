import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, Users, Database, Globe, Mail, FileText, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <Header/>
      

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 mb-6">
              <Shield className="mr-2 h-4 w-4" />
              <span>Privacy & Data Protection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              At Leadify Solutions, we value your privacy and are committed to protecting your personal data. This
              policy explains how we collect, use, and safeguard your information.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards */}
      

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
              {/* Section 1: Information We Collect */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0">
                    <Database className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">1. Information We Collect</h2>
                    <p className="text-gray-600 mb-4">We only collect information necessary to operate our service:</p>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Account Information</h3>
                    <p className="text-sm text-gray-700">Name, email address, and password (encrypted).</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">Saved Streamer Data</h3>
                    <p className="text-sm text-gray-700">
                      Information you choose to save from Twitch searches, which may include publicly available streamer
                      details such as social media links and email addresses.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Cookies</h3>
                    <p className="text-sm text-gray-700">Authentication-related cookies to maintain your session.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg ml-14">
                  <p className="text-sm text-gray-600 font-medium">
                    ✓ We do not collect business-related data, browsing history, or analytics data.
                  </p>
                </div>
              </div>

              {/* Section 2: How We Collect Information */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 shrink-0">
                    <Globe className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">2. How We Collect Information</h2>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Directly from You</h3>
                    <p className="text-gray-600">When you create an account or save streamer data.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Third-Party Integrations</h3>
                    <p className="text-gray-600">
                      We use the Twitch API, Supabase, and LemonSqueezy/Paddle to provide core functionality.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg ml-14">
                  <p className="text-sm text-blue-700">
                    We do not collect additional data automatically outside of what's required for authentication and
                    service functionality.
                  </p>
                </div>
              </div>

              {/* Section 3: How We Use Your Information */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 shrink-0">
                    <Users className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">3. How We Use Your Information</h2>
                    <p className="text-gray-600 mb-4">We use the data we collect for:</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 ml-14">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Account authentication and security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Managing subscriptions and credits</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Providing and improving service functionality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Sending important account updates</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 ml-14">
                  <h3 className="font-semibold text-red-700 mb-3">We do not:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Sell your data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Share your personal data with advertisers or unrelated third parties
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Use your personal data for automated decision-making</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Data Storage & Security */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 shrink-0">
                    <Lock className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">4. Data Storage & Security</h2>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Your data is stored securely on AWS (ap-southeast-1) via Supabase
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Data is kept until your account is deleted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Passwords are encrypted, and we follow industry-standard security practices
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 5: Third-Party Services */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 shrink-0">
                    <Globe className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">5. Third-Party Services</h2>
                    <p className="text-gray-600 mb-4">
                      We work with trusted third parties to provide our service. Your data may be processed by:
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 ml-14">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-blue-900 mb-2">Supabase</h3>
                    <p className="text-sm text-gray-700 mb-2">Database & authentication</p>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Privacy Policy
                    </Button>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-green-900 mb-2">LemonSqueezy</h3>
                    <p className="text-sm text-gray-700 mb-2">Payment processing</p>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Privacy Policy
                    </Button>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <h3 className="font-semibold text-purple-900 mb-2">Twitch API</h3>
                    <p className="text-sm text-gray-700 mb-2">Content creator data</p>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Privacy Policy
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg ml-14">
                  <p className="text-sm text-yellow-800">
                    These services have their own privacy practices, which we encourage you to review.
                  </p>
                </div>
              </div>

              {/* Section 6: Your Rights */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 shrink-0">
                    <Shield className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">6. Your Rights</h2>
                    <p className="text-gray-600 mb-4">You have the right to:</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 ml-14">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Access your personal data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Edit your personal data</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Delete your personal data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Request a copy of your saved data</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg ml-14">
                  <p className="text-sm text-blue-700">
                    To exercise these rights, please contact us via our support email or contact page.
                  </p>
                </div>
              </div>

              {/* Section 7: Cookies */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 shrink-0">
                    <FileText className="h-5 w-5 text-orange-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">7. Cookies</h2>
                  </div>
                </div>

                <div className="ml-14">
                  <p className="text-gray-600 mb-4">
                    We use minimal cookies for authentication purposes only. Disabling these cookies may prevent you
                    from using certain parts of the service.
                  </p>
                </div>
              </div>

              {/* Section 8: Policy Updates */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 shrink-0">
                    <FileText className="h-5 w-5 text-pink-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">8. Policy Updates</h2>
                  </div>
                </div>

                <div className="ml-14">
                  <p className="text-gray-600 mb-4">
                    We may update this Privacy Policy from time to time. If we make significant changes, we will notify
                    you via:
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">In-app notifications</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Email to your registered address</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 9: Contact Us */}
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0">
                    <Mail className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">9. Contact Us</h2>
                  </div>
                </div>

                <div className="ml-14">
                  <p className="text-gray-600 mb-6">
                    For privacy-related concerns, contact us via our [Contact Page] or email [Your Support Email]
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-blue-700 hover:bg-blue-800">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Support
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
                      Visit Contact Page
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Questions About Your Privacy?</h2>
            <p className="text-gray-600 mb-6">
              We're here to help. Reach out to our support team for any privacy-related questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-700 hover:bg-blue-800">
                Get in Touch
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
