import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Leadify",
  description: "Privacy Policy for Leadify - Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-500 mb-8">Last updated: April 11, 2025</p>

          <div className="prose prose-blue max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Leadify ("we," "our," or "us"). We are committed to protecting your privacy and handling your
              data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our website and services.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect several types of information from and about users of our website, including:</p>
            <ul>
              <li>
                <strong>Personal Information:</strong> This includes your name, email address, company name, and payment
                information when you register for an account or subscribe to our services.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our website and services, including your
                search queries, filters applied, and data exported.
              </li>
              <li>
                <strong>Device Information:</strong> Information about the device you use to access our website,
                including IP address, browser type, and operating system.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Protect against harmful, unauthorized, or illegal activity</li>
            </ul>

            <h2>4. Disclosure of Your Information</h2>
            <p>We may disclose your personal information to:</p>
            <ul>
              <li>Service providers who perform services on our behalf</li>
              <li>
                Professional advisors, such as lawyers, auditors, and insurers, where necessary in the course of the
                professional services they provide to us
              </li>
              <li>
                Law enforcement or other government authorities when required by law or in response to a legal process
              </li>
              <li>
                A buyer or other successor in the event of a merger, divestiture, restructuring, reorganization,
                dissolution, or other sale or transfer of some or all of our assets
              </li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We have implemented measures designed to secure your personal information from accidental loss and from
              unauthorized access, use, alteration, and disclosure. However, the transmission of information via the
              internet is not completely secure. Although we do our best to protect your personal information, we cannot
              guarantee the security of your personal information transmitted to our website.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access your personal information</li>
              <li>The right to rectify inaccurate personal information</li>
              <li>The right to request the deletion of your personal information</li>
              <li>The right to restrict the processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to object to the processing of your personal information</li>
            </ul>

            <h2>7. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 16 years of age. We do not knowingly collect personal
              information from children under 16. If you are a parent or guardian and believe your child has provided us
              with personal information, please contact us.
            </p>

            <h2>8. Changes to Our Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. If we make material changes to how we treat our users'
              personal information, we will notify you through a notice on our website or by email.
            </p>

            <h2>9. Contact Information</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at: privacy@leadify.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
