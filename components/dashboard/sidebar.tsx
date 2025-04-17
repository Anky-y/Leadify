"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  History,
  CreditCard,
  User,
  Settings,
  Plug,
  Menu,
  X,
  Users,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Twitch Scraper",
    href: "/dashboard/twitch-scraper",
    icon: Search,
  },
  // {
  //   name: "YouTube Scraper",
  //   href: "/dashboard/youtube-scraper",
  //   icon: Search,
  // },
  // {
  //   name: "CRM",
  //   href: "/dashboard/crm",
  //   icon: Users,
  // },
  // {
  //   name: "Email Sequences",
  //   href: "/dashboard/email-sequences",
  //   icon: Mail,
  // },
  {
    name: "Scrape History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Integrations",
    href: "/dashboard/integrations",
    icon: Plug,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-blue-700 hover:bg-blue-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white dark:bg-gray-950 border-r w-64 shrink-0 overflow-y-auto flex flex-col",
          "fixed inset-y-0 md:mt-14 left-0 z-40  md:z-0 transition-transform duration-200 ease-in-out",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/leadifylogo.png"
              alt="Leadify Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-blue-700">Leadify</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 mb-2">Leadify v1.0.0</div>
          <div className="text-xs text-gray-500">© 2025 Leadify, Inc.</div>
        </div>
      </aside>
    </>
  );
}
