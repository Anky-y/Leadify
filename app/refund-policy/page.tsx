"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CreditCard,
  AlertTriangle,
  Clock,
  Mail,
  FileText,
  ChevronRight,
  ArrowLeft,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function RefundPolicyPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <Header/>
      

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div
            className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 mb-6 animate-fade-in">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Refund & Credit Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Refund Policy</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              At Leadify Solutions, we aim to ensure that our service runs smoothly and delivers value to our users.
              While we generally do not offer monetary refunds, we may issue credit refunds in specific cases outlined
              below.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards */}
      

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div
            className={`max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
              {/* Section 1: Eligibility for Credit Refunds */}
              <div className="p-8 border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">1. Eligibility for Credit Refunds</h2>
                    <p className="text-gray-600 mb-4">We offer refunds in the form of Leadify credits if:</p>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <h3 className="font-semibold text-green-900">Technical Issue</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      A technical issue prevents you from using features you have paid for.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <h3 className="font-semibold text-blue-900">Timely Reporting</h3>
                    </div>
                    <p className="text-sm text-gray-700">You report the issue within 30 days of the transaction.</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                      <h3 className="font-semibold text-purple-900">Proper Documentation</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      You provide proof of the technical issue (e.g., screenshots, error messages).
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Non-Refundable Situations */}
              <div className="p-8 border-b border-gray-100 hover:bg-red-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 shrink-0">
                    <XCircle className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">2. Non-Refundable Situations</h2>
                    <p className="text-gray-600 mb-4">We do not issue refunds in the following cases:</p>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Monetary refunds for subscriptions or credit purchases</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Credits already used for revealing streamer data</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">
                      User error or dissatisfaction unrelated to a technical malfunction
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Violation of our Terms of Service — this forfeits refund eligibility
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Subscriptions & Cancellations */}
              <div className="p-8 border-b border-gray-100 hover:bg-amber-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 shrink-0">
                    <Calendar className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">3. Subscriptions & Cancellations</h2>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <h3 className="font-semibold text-amber-900">No Subscription Refunds</h3>
                    </div>
                    <p className="text-sm text-gray-700">Refunds are not issued for subscription payments.</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Cancellation Policy</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      If you cancel your subscription, you will retain access until the end of your billing period. No
                      prorated refunds are provided.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: How to Request a Refund */}
              <div className="p-8 border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0">
                    <Mail className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">4. How to Request a Refund</h2>
                    <p className="text-gray-600 mb-4">
                      To request a credit refund, contact us with the following information:
                    </p>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Required Information</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                          Your account email address
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                          Proof of technical issue
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
                          Date and time of the issue
                        </li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">Documentation Examples</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-purple-500 rounded-full"></div>
                          Screenshots of errors
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-purple-500 rounded-full"></div>
                          Error message descriptions
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-purple-500 rounded-full"></div>
                          Steps taken to resolve
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Refund Method & Processing */}
              <div className="p-8 border-b border-gray-100 hover:bg-green-50/30 transition-colors duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 shrink-0">
                    <CreditCard className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">5. Refund Method & Processing</h2>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Credit Refunds Only</h3>
                    <p className="text-sm text-gray-700">
                      Approved refunds are issued as Leadify credits added back to your account balance.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Processing Time</h3>
                    <p className="text-sm text-gray-700">Processing usually takes up to 7 business days.</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">Direct Processing</h3>
                    <p className="text-sm text-gray-700">All refunds are handled directly by Leadify Solutions.</p>
                  </div>
                </div>
              </div>

              {/* Section 6: Third-Party Payments */}
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 shrink-0">
                    <Shield className="h-5 w-5 text-orange-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">6. Third-Party Payments</h2>
                  </div>
                </div>

                <div className="ml-14">
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 shrink-0 mt-1">
                        <FileText className="h-4 w-4 text-orange-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-orange-900 mb-2">LemonSqueezy Processing</h3>
                        <p className="text-sm text-gray-700 mb-4">
                          Payments are processed via LemonSqueezy. Any credit refunds will be applied within our system
                          — not processed as monetary refunds through LemonSqueezy.
                        </p>
                        <p className="text-xs text-orange-700 font-medium">
                          This policy ensures fairness to all users while protecting our system from abuse.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>

      {/* Contact Section */}
      
    </div>
  )
}
