import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ | Leadify",
  description: "Frequently asked questions about Leadify and our services.",
}

export default function FAQPage() {
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
                  Frequently Asked Questions
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about Leadify and our services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-blue-900">Getting Started</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is Leadify?</AccordionTrigger>
                    <AccordionContent>
                      Leadify is a platform that helps businesses discover and connect with content creators on
                      platforms like Twitch and YouTube. Our tools enable you to find the perfect influencers for your
                      brand, export their data, and manage your outreach campaigns.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I create an account?</AccordionTrigger>
                    <AccordionContent>
                      To create an account, click the "Sign Up" button in the top right corner of the page. Fill in your
                      details, agree to our Terms of Service and Privacy Policy, and click "Create Account". You'll then
                      have access to our platform and can start using our tools.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer a free plan with limited features. You can use this to explore the platform and see
                      if it meets your needs. For full access to all features, you'll need to upgrade to one of our paid
                      plans.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>What's the difference between the plans?</AccordionTrigger>
                    <AccordionContent>
                      Our Free plan includes basic search functionality with limited results. The Basic plan ($49/month)
                      provides full access to our Twitch scraper with up to 100 exports per month. The Premium plan
                      ($99/month) includes unlimited exports, access to all platforms, and priority support. You can
                      view a detailed comparison on our{" "}
                      <Link href="/pricing" className="text-blue-600 hover:underline">
                        Pricing page
                      </Link>
                      .
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-blue-900">Using the Platform</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I find content creators?</AccordionTrigger>
                    <AccordionContent>
                      You can use our Twitch and YouTube scrapers to find content creators. Navigate to the respective
                      scraper page from your dashboard, set your search criteria (language, follower count, viewer
                      count, etc.), and click "Search". The results will display matching content creators that you can
                      export or add to your CRM.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I save my searches?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can save your searches for future use. After performing a search, click the "Save Search"
                      button, give your search a name, and it will be saved to your account. You can access your saved
                      searches from the "Saved Searches" tab on the scraper page.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How do I export data?</AccordionTrigger>
                    <AccordionContent>
                      After performing a search, you can export the results by selecting your preferred format (CSV,
                      Excel, or JSON) from the dropdown menu and clicking the "Export" button. The file will be
                      downloaded to your device. Free users are limited to 10 results per export, while paid users can
                      export all results.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I use the CRM?</AccordionTrigger>
                    <AccordionContent>
                      Our CRM allows you to manage your leads and outreach campaigns. You can add leads from your
                      scraper results or import them from a CSV file. From the CRM, you can track the status of each
                      lead, add notes, and create email sequences for your outreach campaigns.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-blue-900">Account & Billing</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I upgrade my plan?</AccordionTrigger>
                    <AccordionContent>
                      To upgrade your plan, go to the Billing section in your dashboard and click "Upgrade". Select your
                      preferred plan, enter your payment details, and confirm the subscription. Your account will be
                      immediately upgraded with access to the new features.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I cancel my subscription?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can cancel your subscription at any time. Go to the Billing section in your dashboard and
                      click "Cancel Subscription". Your subscription will remain active until the end of your current
                      billing period, after which you'll be downgraded to the Free plan.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Do you offer annual billing?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer annual billing with a 20% discount compared to monthly billing. When upgrading your
                      plan, you can select the annual billing option to take advantage of this discount.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I update my payment information?</AccordionTrigger>
                    <AccordionContent>
                      You can update your payment information in the Billing section of your dashboard. Click on
                      "Payment Methods", then "Edit" next to your current payment method or "Add Payment Method" to add
                      a new one.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-blue-900">Data & Privacy</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How is my data stored and protected?</AccordionTrigger>
                    <AccordionContent>
                      We take data security seriously. All data is encrypted both in transit and at rest. We use
                      industry-standard security measures to protect your information. For more details, please refer to
                      our{" "}
                      <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I delete my account and data?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can delete your account and all associated data at any time. Go to the Settings section
                      in your dashboard and click "Delete Account". This action is irreversible and will permanently
                      delete all your data from our systems.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Where does the creator data come from?</AccordionTrigger>
                    <AccordionContent>
                      Our platform collects publicly available data from content creator profiles on platforms like
                      Twitch and YouTube. We do not access private or restricted information. The data is regularly
                      updated to ensure accuracy.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Is it legal to scrape this data?</AccordionTrigger>
                    <AccordionContent>
                      Our platform only collects publicly available information that content creators have chosen to
                      share. We comply with all relevant laws and platform terms of service. We recommend using the data
                      responsibly and in accordance with applicable laws and regulations.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-blue-900">Technical Support</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I get support?</AccordionTrigger>
                    <AccordionContent>
                      For technical support, you can contact our team via the Help section in your dashboard or by
                      emailing support@leadify.com. Premium users receive priority support with faster response times.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Do you offer onboarding or training?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer onboarding sessions for new Premium users to help you get the most out of our
                      platform. You can schedule a session with our team after upgrading to the Premium plan. We also
                      provide comprehensive documentation and video tutorials for all users.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What browsers are supported?</AccordionTrigger>
                    <AccordionContent>
                      Our platform supports all modern browsers, including Chrome, Firefox, Safari, and Edge. For the
                      best experience, we recommend using the latest version of your preferred browser.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Is there a mobile app?</AccordionTrigger>
                    <AccordionContent>
                      Currently, we don't have a dedicated mobile app, but our platform is fully responsive and can be
                      accessed from any device with a web browser. We're considering developing mobile apps in the
                      future.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="mt-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-blue-900">Features & Integrations</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What platforms do you support?</AccordionTrigger>
                    <AccordionContent>
                      We currently support Twitch and YouTube, with plans to add more platforms in the future. Our
                      roadmap includes Instagram, TikTok, and other popular content creation platforms.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I integrate with other tools?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer integrations with popular tools like Google Sheets, Gmail, Airtable, Notion, and
                      more. You can set up these integrations in the Integrations section of your dashboard. We also
                      offer a Zapier integration for connecting with thousands of other apps.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Do you have an API?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer an API for Premium users. This allows you to programmatically access our data and
                      integrate it with your own systems. API documentation is available in the Developer section of
                      your dashboard.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>What email automation features do you offer?</AccordionTrigger>
                    <AccordionContent>
                      Our email automation system allows you to create personalized email sequences for your outreach
                      campaigns. You can set up follow-up emails, customize send times, and use dynamic variables to
                      personalize your messages. The system also tracks opens, clicks, and replies to help you measure
                      the effectiveness of your campaigns.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How does the CRM work?</AccordionTrigger>
                    <AccordionContent>
                      Our CRM (Customer Relationship Management) system helps you manage your leads and outreach
                      campaigns. You can add leads from your scraper results or import them from a CSV file. The CRM
                      tracks the status of each lead, allows you to add notes and tags, and integrates with our email
                      automation system for seamless outreach.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-900">Still Have Questions?</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our team is here to help. Contact us for personalized assistance.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/contact">
                  <button className="inline-flex h-10 items-center justify-center rounded-md bg-blue-700 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700">
                    Contact Support
                  </button>
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
