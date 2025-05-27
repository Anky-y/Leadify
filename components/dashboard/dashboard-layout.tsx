"use client";

import type React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { MobileSidebarTrigger } from "./mobile-sidebar-trigger";
import { DashboardHeader } from "./dashboard-header";
import { useUser } from "@/app/context/UserContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useUser();
  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader onLogout={handleLogout} user={user} />
        <div className="flex flex-1 flex-col ">{children}</div>
      </SidebarInset>
      <MobileSidebarTrigger />
    </SidebarProvider>
  );
}
