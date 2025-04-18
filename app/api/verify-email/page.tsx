"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailCode } from "./verifyEmailCode";

export default function VerifyEmailPageApi() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying"); // States: verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");
  console.log("in email verifier");

  useEffect(() => {
    const code = searchParams.get("code");

    console.log("Code from email verification:", code);

    if (!code) {
      setStatus("error");
      setErrorMessage("Invalid token.");
      return;
    }
    const verifyEmail = async () => {
      try {
        const result = await verifyEmailCode(code);

        if (result.success) {
          setStatus("success");
          router.push("/dashboard"); // Redirect to dashboard after successful verification
        }
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error.message || "Something went wrong.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  if (status === "verifying") {
    return (
      <div>
        <h1>Verifying your email...</h1>
        <p>Please wait while we verify your email.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div>
        <h1>Error</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return null; // The page redirects once the email is verified
}
