import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Leadify",
  description: "Terms of Service for Leadify - Please read these terms carefully before using our platform.",
}

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-gray-500 mb-8">Last updated: April 11, 2025</p>

          <div className="prose prose-blue max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Leadify's website and services, you agree to be bound by these Terms of Service
              ("Terms"). If you do not agree to these Terms, you may not access or use our services.
            </p>

            <h2>2. Description of Services</h2>
            <p>
              Leadify provides tools for discovering and connecting with content creators on platforms such as Twitch.
              Our services include data collection, filtering, and export capabilities to help businesses find suitable
              content creators for their marketing campaigns.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of our services, you must create an account. You are responsible for
              maintaining the confidentiality of your account credentials and for all activities that occur under your
              account. You agree to provide accurate and complete information when creating your account and to update
              your information as necessary.
            </p>

            <h2>4. Subscription and Payment</h2>
            <p>
              Some of our services require a paid subscription. By subscribing to our services, you agree to pay the
              applicable fees as they become due. We may change our fees at any time, but changes will not apply
              retroactively. If we change our fees, we will provide notice of the change on our website or by email.
            </p>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to use our services to:</p>
            <ul>
              <li>Violate any applicable law or regulation</li>
              <li>Infringe the rights of any third party</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Send spam or other unsolicited messages</li>
              <li>Interfere with the proper functioning of our services</li>
              <li>Attempt to gain unauthorized access to our services or systems</li>
            </ul>

            <h2>6. Data Usage and Privacy</h2>
            <p>
              Our collection and use of your personal information is governed by our Privacy Policy. By using our
              services, you consent to our collection and use of your personal information as described in our Privacy
              Policy.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              Our services and all content and materials included on our website, including but not limited to text,
              graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software,
              are the property of Leadify or our licensors and are protected by copyright, trademark, and other
              intellectual property laws.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Leadify shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to
              or use of or inability to access or use our services.
            </p>

            <h2>9. Termination</h2>
            <p>
              We may terminate or suspend your account and access to our services at any time, without prior notice or
              liability, for any reason, including if you violate these Terms. Upon termination, your right to use our
              services will immediately cease.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. If we make material changes to these Terms, we will notify you by
              email or by posting a notice on our website. Your continued use of our services after such notification
              constitutes your acceptance of the modified Terms.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California,
              without regard to its conflict of law provisions.
            </p>

            <h2>12. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at: legal@leadify.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
