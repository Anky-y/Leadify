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
import { getSession, getUserData, signInWithEmail } from "@/lib/utils/auth";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import GuestOnly from "@/components/GuestOnly";
import { useUserContext } from "../context/UserContext";

export default function LoginPage() {
  const { setSession, setUser } = useUserContext()!;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const user = await signInWithEmail(email!, password!);
      if (user) {
        const session = await getSession();
        const userData = await getUserData();
        setSession(session);
        setUser(userData);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  }

  function LoginButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        className="w-full bg-blue-700 hover:bg-blue-800"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    );
  }

  return (
    <GuestOnly>
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
                  Welcome back
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email || ""}
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-700 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password || ""}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me for 30 days
                    </Label>
                  </div>
                  <LoginButton />
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-700 hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </GuestOnly>
  );
}
