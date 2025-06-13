"use client";

import * as React from "react";
import {
  Bell,
  HelpCircle,
  CreditCard,
  Settings,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import User from "../../app/types/user";
import { getPlanName } from "@/utils/qol_Functions";

interface DashboardHeaderProps {
  user?: User | null;
  subscription?: Subscription | null;
  onLogout?: () => void;
}

export function DashboardHeader({
  user,
  subscription,
  onLogout,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = React.useState<string>("");

  React.useEffect(() => {
    if (pathname) {
      setPageTitle(getTitleFromUrl(pathname));
    }
  }, [pathname]);
  const [notifications] = React.useState([
    {
      id: 1,
      title: "New search completed",
      description: "Your Twitch scraper search found 127 new streamers",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Credits running low",
      description: "You have 142 credits remaining",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Export ready",
      description: "Your CSV export is ready for download",
      time: "3 hours ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  function getTitleFromUrl(url: String) {
    // Split the URL by slashes and take the last part
    const segments = url.split("/");
    const lastSegment = segments.pop() || segments.pop(); // handles trailing slashes

    if (!lastSegment) return "Dashboard";

    // Replace hyphens with spaces and capitalize each word
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  console.log(user);
  console.log(subscription);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="-ml-1" />

        {/* Page Title */}
        <div className="flex items-center gap-2 flex-1">
          {/* {pageTitle && (
            <h1 className="text-lg font-semibold text-foreground">
              {pageTitle}
            </h1>
          )} */}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Credits Display */}
          <Button
            variant="outline"
            size="sm"
            className="group relative overflow-hidden border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 transition-all duration-300 hover:from-slate-100 hover:to-slate-200 hover:shadow-md dark:border-blue-800 dark:from-blue-950 dark:to-blue-900 dark:text-blue-300 dark:hover:from-blue-900 dark:hover:to-blue-800"
          >
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-amber-500 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">{user?.credits || 0}</span>
              <span className="hidden sm:inline text-xs">Credits</span>
            </div>
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative transition-all duration-200 hover:bg-accent"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-[0.35rem] text-xs bg-blue-600 hover:bg-blue-600">
                    {unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="border-b p-4">
                <h4 className="font-semibold">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  You have {unreadCount} unread notifications
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b p-4 transition-colors hover:bg-accent ${
                      notification.unread
                        ? "bg-blue-50/50 dark:bg-blue-950/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-2 w-2 rounded-full mt-2 ${
                          notification.unread ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-2">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Mark all as read
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            className="transition-all duration-200 hover:bg-accent"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-auto rounded-full pl-2 pr-3 transition-all duration-200 hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${user?.id}`}
                      alt={user?.first_name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                      {user?.first_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {user?.first_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {subscription?.plan_name
                        ? getPlanName(subscription.plan_name) + " Plan"
                        : "Free Plan"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 animate-in slide-in-from-top-2 duration-200"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${user?.id}`}
                        alt={user?.first_name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                        {user?.first_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">
                        {user?.first_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {user?.subscription_status ? (
                      <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 hover:from-blue-700 hover:to-blue-800">
                        {subscription?.plan_name
                          ? getPlanName(subscription.plan_name) + " Plan"
                          : "Free Plan"}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-gray-300">
                        {subscription?.plan_name
                          ? getPlanName(subscription.plan_name) + " Plan"
                          : "Free Plan"}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3 text-amber-500" />
                      <span>{user?.credits || 0}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950"
                onSelect={(e) => {
                  e.preventDefault();
                  onLogout?.();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
