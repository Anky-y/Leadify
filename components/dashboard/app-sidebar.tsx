"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Search,
  History,
  CreditCard,
  User,
  Settings,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
// Navigation items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Twitch Scraper",
    url: "/dashboard/twitch-scraper",
    icon: Search,
  },
  {
    title: "Scrape History",
    url: "/dashboard/history",
    icon: History,
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const [activeItem, setActiveItem] = React.useState("/dashboard");
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-blue-700 dark:text-blue-400 group-data-[collapsible=icon]:hidden">
            Leadify
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 dark:data-[active=true]:bg-blue-900 dark:data-[active=true]:text-blue-300"
                    tooltip={item.title}
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-4 py-3 text-xs text-muted-foreground space-y-1">
          <div className="font-medium">Leadify v1.0.0</div>
          <div>© 2025 Leadify, Inc.</div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
