"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileSidebarTrigger() {
  const { toggleSidebar, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <Button
      variant="default"
      size="icon"
      className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
      onClick={toggleSidebar}
    >
      <Menu className="h-6 w-6 text-white" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
