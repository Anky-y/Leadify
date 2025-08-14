"use client"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Database,
  Globe,
  Mail,
  FileText,
  ChevronRight,
  CreditCard,
  UserCheck,
  AlertTriangle,
  Gavel,
} from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 mb-6 animate-fade-in">
              <Gavel className="mr-2 h-4 w-4" />
              <span>Legal Terms & Conditions</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 animate-slide-up">Terms & Conditions</h1>
            <p className="text-xl text-gray-600 leading-relaxed animate-slide-up-delay">
              These Terms & Conditions govern your access to and use of Leadify. By creating an account or using our
              Service, you agree to these Terms.
            </p>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in-delay">
              <p className="text-sm text-amber-800">
                <strong>Effective Date:</strong> January 15, 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden animate-fade-in-up">
              {/* Section 1: Service Overview */}
              <div className="p-8 border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0 animate-bounce-subtle">
                    <Globe className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">1. Service Overview</h2>
                  </div>
                </div>

                <div className="ml-14 space-y-4">
                  <p className="text-gray-600">
                    Leadify is a web-based SaaS application that allows users to search live Twitch streamers based on
                    specific criteria and reveal publicly available contact details in exchange for credits.
                  </p>
                  <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                    <p className="text-sm text-amber-800 font-medium">
                      ⚠️ We are not affiliated with Twitch or any other third-party services used in our platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Eligibility & Accounts */}
              <div className="p-8 border-b border-gray-100 hover:bg-green-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 shrink-0 animate-pulse-subtle">
                    <UserCheck className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">2. Eligibility & Accounts</h2>
                  </div>
                </div>

                <div className="ml-14 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">You must be at least 18 years old to use Leadify</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Accounts may be used, transferred, or shared at your discretion; however, you are responsible for
                      all activity under your account
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-red-700 mb-3">
                      We reserve the right to suspend or terminate accounts for:
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">Violations of these Terms</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">Abuse of the Service</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">Fraud or other harmful behavior</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Credits & Payments */}
              <div className="p-8 border-b border-gray-100 hover:bg-purple-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 shrink-0 animate-bounce-subtle">
                    <CreditCard className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">3. Credits & Payments</h2>
                  </div>
                </div>

                <div className="ml-14 space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">About Credits</h3>
                    <p className="text-sm text-gray-700">
                      Credits are a virtual currency within Leadify. They have no cash value and cannot be exchanged for
                      real money.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Credits remain valid until your account is deleted</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Subscriptions are auto-renewed unless canceled before the next billing date
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                        <span className="text-gray-700">
                          We may remove credits in cases of abuse, fraud, or violation of these Terms
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-700">We may adjust pricing or credit costs with prior notice</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: User Data & Content */}
              <div className="p-8 border-b border-gray-100 hover:bg-indigo-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 shrink-0 animate-pulse-subtle">
                    <Database className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">4. User Data & Content</h2>
                  </div>
                </div>

                <div className="ml-14 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Leadify is a tool that retrieves publicly available data from Twitch
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">
                      We do not own the data retrieved; you may use it for your own purposes, subject to applicable laws
                    </span>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> We do not restrict how you use retrieved data, but you are solely
                      responsible for ensuring your usage complies with all laws and regulations (e.g., anti-spam laws).
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5: Acceptable Use */}
              <div className="p-8 border-b border-gray-100 hover:bg-red-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 shrink-0 animate-bounce-subtle">
                    <AlertTriangle className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">5. Acceptable Use</h2>
                    <p className="text-gray-600 mb-4">You agree not to:</p>
                  </div>
                </div>

                <div className="ml-14 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Use the Service for any illegal purposes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Attempt to reverse-engineer, bypass credit limits, or otherwise interfere with our systems
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Exploit the Service in ways that cause harm to other users, Twitch, Twitch Streamers or our
                      infrastructure
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 6: Service Availability */}
              <div className="p-8 border-b border-gray-100 hover:bg-green-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 shrink-0 animate-pulse-subtle">
                    <Globe className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">6. Service Availability</h2>
                  </div>
                </div>

                <div className="ml-14">
                  <p className="text-gray-600 mb-4">
                    We aim to maintain high availability but may take the Service offline for maintenance or updates
                    with prior notice. We are not liable for downtime caused by third-party providers.
                  </p>
                </div>
              </div>

              {/* Section 7: Disclaimers & Limitation of Liability */}
              <div className="p-8 border-b border-gray-100 hover:bg-amber-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 shrink-0 animate-bounce-subtle">
                    <Shield className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">7. Disclaimers & Limitation of Liability</h2>
                  </div>
                </div>

                <div className="ml-14 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                      <span className="text-gray-700">
                        We do not guarantee the accuracy, completeness, or availability of scraped data
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                      <span className="text-gray-700">
                        We are not responsible for any damages, disputes, or legal consequences arising from your use of
                        the data
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                      <span className="text-gray-700">
                        We are not liable for service interruptions caused by third-party services (Twitch API,
                        Supabase, LemonSqueezy, etc.)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 8: Termination */}
              <div className="p-8 border-b border-gray-100 hover:bg-red-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 shrink-0 animate-pulse-subtle">
                    <AlertTriangle className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">8. Termination</h2>
                  </div>
                </div>

                <div className="ml-14 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">
                      We may suspend or terminate your account without prior notice if you violate these Terms
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Upon termination, any unused credits will be forfeited</span>
                  </div>
                </div>
              </div>

              {/* Section 9: Changes to Terms */}
              <div className="p-8 border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0 animate-bounce-subtle">
                    <FileText className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">9. Changes to Terms</h2>
                  </div>
                </div>

                <div className="ml-14 space-y-4">
                  <p className="text-gray-600 mb-4">
                    We may update these Terms from time to time. Significant changes will be communicated via:
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">In-app notifications</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Email notifications when necessary</span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Continued use of the Service after updates means you accept the revised Terms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 10: Contact Us */}
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 shrink-0 animate-pulse-subtle">
                    <Mail className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">10. Contact Us</h2>
                  </div>
                </div>

                <div className="ml-14">
                  <p className="text-gray-600 mb-6">
                    If you have any questions about these Terms, please contact us via our Contact Page or email us at
                    our support email.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-blue-700 hover:bg-blue-800 transition-all duration-300 hover:scale-105">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Support
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent transition-all duration-300 hover:scale-105"
                    >
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
      

      <Footer />
    </div>
  )
}
