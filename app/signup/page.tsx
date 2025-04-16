"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase";
import { handleSignup } from "./signup";
const initialState = { error: null };
export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  function SignupButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        className="w-full bg-blue-700 hover:bg-blue-800"
        type="submit"
        disabled={pending}
      >
        {pending ? "Creating account..." : "Create Account"}
      </Button>
    );
  }

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
              <CardTitle className="text-2xl font-bold text-center text-blue-900">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to get started with Leadify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form
                action={async (formData) => handleSignup(formData)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      name="first-name"
                      placeholder="John"
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName || ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      name="last-name"
                      placeholder="Doe"
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName || ""}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password || ""}
                    required
                  />
                </div>
                <SignupButton />
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
