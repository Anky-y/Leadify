import type React from "react";
import type { Metadata } from "next";
// import { requireAuth } from "@/app/auth";
import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/header";

// import DashboardPageWrapper from "@/components/dashboard/DashboardPageWrapper";
import { createClient } from "@/utils/supabase";
import { redirect } from "next/navigation";
import { getUserData } from "@/utils/auth";
import User from "../types/user";

export const metadata: Metadata = {
  title: "Dashboard | Leadify",
  description: "Manage your Leadify account and access your tools.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user data on component mount
  const user: User | null = await getUserData();
  if (!user) {
    // Redirect to login if no user is found
    return redirect("/login");
  }
  // const user = useUser();
  return (
    // <UserProvider user={user}>
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto md:ml-64">
          {children}
        </main>
      </div>
    </div>
    // </UserProvider>
  );
}
