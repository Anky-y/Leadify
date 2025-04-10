import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900">
              Ready to Find Your Perfect Streamers?
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Sign up for early access and get 20% off your first three months
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex flex-col gap-2 sm:flex-row">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your email"
                type="email"
              />
              <Button className="bg-blue-700 hover:bg-blue-800">Get Early Access</Button>
            </form>
            <p className="text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <Link href="#" className="underline underline-offset-2">
                Terms & Conditions
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
