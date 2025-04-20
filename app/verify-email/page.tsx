"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, RefreshCw, MailOpen } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resendEmail } from "./verify-email-functions";

export default function VerifyEmailPageClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  //   const router = useRouter();

  // Countdown for resend button
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleResendEmail = async () => {
    console.log("Resending email in page:", email);
    setIsResending(true);
    resendEmail(email);
    setTimeout(() => {
      setIsResending(false);
      setSecondsLeft(60);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md border-blue-100">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">
            Verify your email
          </CardTitle>
          <CardDescription>
            We've sent a verification link to{" "}
            <span className="font-medium">{email}</span>. Please check your
            inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            <p>
              After clicking the verification link, you’ll be redirected to our
              site automatically.
            </p>
          </div>
          <p>
            Didn't receive the email? Check your spam folder or click below to
            resend.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleResendEmail}
            variant="outline"
            className="w-full"
            disabled={secondsLeft > 0 || isResending}
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : secondsLeft > 0 ? (
              `Resend email (${secondsLeft}s)`
            ) : (
              "Resend verification email"
            )}
          </Button>
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline inline-flex items-center"
          >
            Check Gmail
            <MailOpen className="h-4 w-4 ms-1" />
          </a>
          <div className="text-center text-sm">
            <Link href="/login" className="text-blue-700 hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
