"use client";

import { useEffect, useState } from "react";
import { useUserSession } from "../app/context/UserSessionContext";
import { useRouter } from "next/navigation";
import { LoadingPage } from "./loading-page";
import { useUserContext } from "@/app/context/UserContext";

export default function GuestOnly({ children }: { children: React.ReactNode }) {
  const { session, loading } = useUserContext();
  const router = useRouter();
  useEffect(() => {
    if (!loading && session) {
      router.replace("/dashboard");
    }
  }, [session, loading]);

  if (loading) return null;
  if (session) return null;

  return <>{children}</>;
}
