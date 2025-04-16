// "use client";

// import { useEffect, useState } from "react";
// import { useUserSession } from "../app/context/UserSessionContext";
// import { useRouter } from "next/navigation";
// import LoadingScreen from "./loading-screen";
// import { useUserContext } from "@/app/context/UserContext";

// export default function GuestOnly({ children }: { children: React.ReactNode }) {
//   const { session, loading } = useUserContext();
//   const router = useRouter();
//   useEffect(() => {
//     if (session !== null) {
//       router.replace("/dashboard"); // Replace to prevent going back to the guest-only page
//     }
//   }, [session, loading, router]);

//   // If loading, show a loading screen
//   if (loading) {
//     return <LoadingScreen />;
//   }

//   // If session exists, prevent rendering guest content
//   if (session) {
//     return <LoadingScreen />; // Or show a message like "Redirecting..."
//   }

//   return <>{children}</>;
// }
