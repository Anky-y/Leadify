// components/DashboardPageWrapper.tsx
"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useUserContext } from "@/app/context/UserContext"; // interface DashboardUIProps {
import { LoadingPage } from "../loading-page";

export default function DashboardPageWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { session, loading } = useUserContext();

  useEffect(() => {
    console.log("inside use effect, session:", session);
    if (session === null) {
      console.log("Session is null, redirecting to login...");
      router.replace("/login");
    }
  }, [session]);

  console.log(session);

  // if (session.session === null) {
  //   return (
  //     <LoadingPage
  //       title="Loading Dashboard"
  //       subtitle="Please wait while we prepare your content..."
  //     />
  //   );
  // }

  if (loading) {
    return (
      <LoadingPage
        title="Loading Dashboard"
        subtitle="Please wait while we prepare your content..."
      />
    );
  }

  return <>{children}</>;
}
