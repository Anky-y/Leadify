"use client";

import type React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { MobileSidebarTrigger } from "./mobile-sidebar-trigger";
import { DashboardHeader } from "./dashboard-header";
import { useUser } from "@/app/context/UserContext";
import { handleLogout } from "./logout";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const handleLogoutClick = async () => {
    const { error } = await handleLogout();

    if (error) {
      console.error("Logout failed:", error);
      return;
    }

    // Redirect to login page after logout
    router.replace("/");
    refreshUser();
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader onLogout={handleLogoutClick} user={user} />
        <div className="flex flex-1 flex-col ">{children}</div>
      </SidebarInset>
      <MobileSidebarTrigger />
    </SidebarProvider>
  );
}
