import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container px-4 md:px-6 flex justify-center">
          <Card className="w-full max-w-md border-blue-100">
            <CardHeader className="space-y-1 flex flex-col items-center">
              <div className="flex items-center justify-center mb-2">
                <Image
                  src="/images/leadifylogo.png"
                  alt="Leadify Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-blue-900">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your information to get started with Leadify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (optional)</Label>
                <Input id="company" placeholder="Your company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long and include a number and a special character.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-700 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-700 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-blue-700 hover:bg-blue-800">Create Account</Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-700 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
