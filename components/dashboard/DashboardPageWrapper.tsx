// // components/DashboardPageWrapper.tsx
// "use client";

// import { useRouter } from "next/navigation";
// import { ReactNode, useEffect } from "react";
// import LoadingScreen from "../loading-screen";

// export default function DashboardPageWrapper({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const router = useRouter();
//   const { session, loading } = useUserContext();

//   // If session is null after loading, redirect to login
//   useEffect(() => {
//     if (session === null) {
//       router.replace("/login"); // Replace to prevent back navigation to protected route
//     }
//   }, [session, loading, router]);

//   // If loading, show a loading screen
//   if (loading) {
//     return <LoadingScreen />;
//   }

//   // If session exists, prevent rendering guest content
//   if (session === null) {
//     return <LoadingScreen />; 
//   }

//   return <>{children}</>;
// }
