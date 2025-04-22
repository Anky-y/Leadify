"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailCode } from "./verifyEmailCode";
import { parseHashParams } from "@/utils/parseHash";
import { useUser } from "@/app/context/UserContext";

export default function VerifyEmailPageApi() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying"); // States: verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");
  console.log("in email verifier");
  const { refreshUser } = useUser(); // Access refreshUser from the context

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    console.log("Token hash:", tokenHash);
    // utils/parseHash.ts
    const { error } = parseHashParams(window.location.hash);

    console.log(error);
    if (!tokenHash) {
      setStatus("error");
      setErrorMessage(error);
      router.push("/api/invalid-link");
      return;
    }
    if (error) {
      console.log(error);
      if (error === "access_denied") {
        console.log("redirecting to invalid link");
        router.push("/api/invalid-link");
      }
    }
    const verifyEmail = async () => {
      try {
        const result = await verifyEmailCode(tokenHash);

        if (result.success) {
          setStatus("success");
          await refreshUser(); // Refresh user data after verification
          router.push("/dashboard"); // Redirect to dashboard after successful verification
        }
      } catch (error: any) {
        console.log(error);
        setStatus("error");
        router.push("/api/invalid-link");
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
