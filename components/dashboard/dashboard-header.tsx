"use client"

import * as React from "react"
import {
  Bell,
  HelpCircle,
  CreditCard,
  Settings,
  LogOut,
  UserIcon,
  ChevronDown,
  Zap,
  Trash2,
  ChevronUp,
  ChevronRight,
  Megaphone,
  Cog,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import type User from "../../app/types/user"
import { createClient } from "@supabase/supabase-js"
import { getPlanName } from "@/utils/qol_Functions";

interface DashboardHeaderProps {
  user?: User | null,
  subscription?: Subscription | null;
  onLogout?: () => void
}

export function DashboardHeader({ user,  subscription,
 onLogout }: DashboardHeaderProps) {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = React.useState<string>("")
  const [expandedNotifications, setExpandedNotifications] = React.useState<Record<string | number, boolean>>({})

  React.useEffect(() => {
    if (pathname) {
      setPageTitle(getTitleFromUrl(pathname))
    }
  }, [pathname])

  // Create Supabase client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Replace the hardcoded notifications state with:
  const [notifications, setNotifications] = React.useState<any[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = React.useState(true)

  // Add useEffect to fetch notifications
React.useEffect(() => {
  const fetchNotifications = async () => {
    console.log("Before the if statement line n67")
    if (!user?.id) {
      console.log("Inside if statemnet line 69 nice")
      setIsLoadingNotifications(false)
      return
    }

    try {
      console.log("Inside the try block line 75")
      setIsLoadingNotifications(true)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id }),
      })

      const result = await res.json()

      if (!result.success) {
        console.error("Backend error fetching notifications")
        return
      }

      setNotifications(result.notifications)
    } catch (error) {
      console.error("Frontend error fetching notifications:", error)
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  fetchNotifications()
}, [user?.id])

  React.useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new
          setNotifications((prev) => [
            {
              id: newNotification.id,
              title: newNotification.title,
              description: newNotification.description,
              time: formatTimeAgo(newNotification.created_at),
              unread: !newNotification.read,
              type: newNotification.type || null,
              created_at: newNotification.created_at,
            },
            ...prev,
          ])
        },
      )
      .subscribe()

    // Cleanup on unmount or user change
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  // Add helper function to format time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes === 1) return "1 minute ago"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours === 1) return "1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    return `${diffInDays} days ago`
  }

  const deleteNotification = async (notificationId: number) => {
    if (!user?.id) return

    try {
      const { error } = await supabase.from("notifications").delete().eq("id", notificationId).eq("user_id", user.id)

      if (error) {
        console.error("Error deleting notification:", error)
        return
      }

      // Update local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const markAsRead = async (notificationId: number) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error marking notification as read:", error)
        return
      }

      // Update local state
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, unread: false } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const deleteAllNotifications = async () => {
    if (!user?.id) return

    try {
      const { error } = await supabase.from("notifications").delete().eq("user_id", user.id)

      if (error) {
        console.error("Error deleting all notifications:", error)
        return
      }

      // Update local state
      setNotifications([])
    } catch (error) {
      console.error("Error deleting all notifications:", error)
    }
  }

  const toggleExpandNotification = (id: number | string) => {
    setExpandedNotifications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getTypeBadgeConfig = (type: string | null) => {
    if (!type) return null

    // Determine notification type and return appropriate styling for badges only
    if (type.toLowerCase().includes("announcement")) {
      return {
        icon: Megaphone,
        badgeClass:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
        iconClass: "text-emerald-600 dark:text-emerald-400",
        displayText: "ANNOUNCEMENT",
      }
    } else if (type.toLowerCase().includes("system")) {
      return {
        icon: Cog,
        badgeClass:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800",
        iconClass: "text-orange-600 dark:text-orange-400",
        displayText: "SYSTEM",
      }
    } else if (type.toLowerCase().includes("feature")) {
      return {
        icon: Sparkles,
        badgeClass:
          "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 border-violet-200 dark:border-violet-800",
        iconClass: "text-violet-600 dark:text-violet-400",
        displayText: "FEATURE",
      }
    } else {
      // For any other non-empty type values - show actual type with important red styling
      return {
        icon: null,
        badgeClass:
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800 font-semibold",
        iconClass: "text-red-600 dark:text-red-400",
        displayText: type.toUpperCase(),
      }
    }
  }

  const unreadCount = notifications.filter((n) => n.unread).length


  function getTitleFromUrl(url: string) {
    // Split the URL by slashes and take the last part
    const segments = url.split("/")
    const lastSegment = segments.pop() || segments.pop() // handles trailing slashes

    if (!lastSegment) return "Dashboard"

    // Replace hyphens with spaces and capitalize each word
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Function to check if description is long enough to need expansion
  const isDescriptionLong = (description: string) => {
    return description.length > 120
  }

  // Function to check if title is long enough to need expansion
  const isTitleLong = (title: string) => {
    return title.length > 60
  }
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
              <Button variant="ghost" size="icon" className="relative transition-all duration-200 hover:bg-accent">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-[0.35rem] text-xs bg-blue-600 hover:bg-blue-600">
                    {unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <div className="border-b p-4">
                <h4 className="font-semibold">Notifications</h4>
                <p className="text-sm text-muted-foreground">You have {unreadCount} unread notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {isLoadingNotifications ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const badgeConfig = getTypeBadgeConfig(notification.type)
                    const isExpanded = expandedNotifications[notification.id] || false
                    const titleNeedsExpansion = isTitleLong(notification.title)
                    const descriptionNeedsExpansion = isDescriptionLong(notification.description)
                    const needsExpansion = titleNeedsExpansion || descriptionNeedsExpansion

                    return (
                      <div
                        key={notification.id}
                        className={`group relative border-b last:border-b-0 p-4 transition-all duration-200 hover:bg-accent/50 select-none ${
                          notification.unread
                            ? "bg-gradient-to-r from-blue-50/80 to-blue-50/40 dark:from-blue-950/40 dark:to-blue-950/20 border-l-2 border-l-blue-500"
                            : "hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <div className="flex items-start gap-3 pr-8">
                          {/* Read/Unread Indicator */}
                          <div className="flex-shrink-0 mt-1">
                            {notification.unread ? (
                              <div className="relative">
                                <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 h-3 w-3 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                              </div>
                            ) : (
                              <div className="h-3 w-3 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-2 min-w-0">
                            {/* Title and Type Badge */}
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-sm font-medium leading-tight ${
                                  isExpanded || !titleNeedsExpansion ? "" : "line-clamp-1"
                                } ${
                                  notification.unread
                                    ? "text-gray-900 dark:text-gray-100"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {badgeConfig && (
                                  <>
                                    {badgeConfig.icon && (
                                      <badgeConfig.icon className={`h-3 w-3 ${badgeConfig.iconClass}`} />
                                    )}
                                    <Badge className={`text-xs px-1.5 py-0.5 ${badgeConfig.badgeClass}`}>
                                      {badgeConfig.displayText}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            <div className="text-sm text-muted-foreground/90 leading-relaxed">
                              <p className={isExpanded || !descriptionNeedsExpansion ? "" : "line-clamp-2"}>
                                {notification.description}
                              </p>
                              {needsExpansion && (
                                <button
                                  onClick={() => toggleExpandNotification(notification.id)}
                                  className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center mt-1 hover:underline transition-colors duration-200"
                                >
                                  {isExpanded ? (
                                    <>
                                      Show less <ChevronUp className="h-3 w-3 ml-0.5" />
                                    </>
                                  ) : (
                                    <>
                                      Read more <ChevronRight className="h-3 w-3 ml-0.5" />
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Time and Actions */}
                            <div className="flex items-center justify-between pt-1">
                              <p className="text-[10px] text-muted-foreground/70 font-medium">{notification.time}</p>
                              <div className="flex items-center gap-2">
                                {/* Mark as Read Button - always visible for unread notifications */}
                                {notification.unread && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="px-2 py-1 text-xs rounded-md bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 transition-colors duration-200"
                                    title="Mark as read"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                {/* Delete Button */}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                  title="Delete notification"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <div className="border-t p-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-1/2 text-xs"
                  disabled={notifications.length === 0 || unreadCount === 0}
                  onClick={async () => {
                    if (!user?.id) return

                    try {
                      await supabase
                        .from("notifications")
                        .update({ read: true })
                        .eq("user_id", user.id)
                        .eq("read", false)

                      // Update local state
                      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                    } catch (error) {
                      console.error("Error marking notifications as read:", error)
                    }
                  }}
                >
                  Mark all as read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-1/2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 disabled:text-red-300 dark:disabled:text-red-800 disabled:hover:bg-transparent"
                  onClick={deleteAllNotifications}
                  disabled={notifications.length === 0}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete all
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Help */}
          <Button variant="ghost" size="icon" className="transition-all duration-200 hover:bg-accent">
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
                    <AvatarImage src={`https://avatar.vercel.sh/${user?.id}`} alt={user?.first_name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                      {user?.first_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.first_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.subscription_plan
                        ? getPlanName(user?.subscription_plan) + " Plan"
                        : "Free Plan"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 animate-in slide-in-from-top-2 duration-200" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://avatar.vercel.sh/${user?.id}`} alt={user?.first_name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                        {user?.first_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">{user?.first_name}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email}</p>
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
                  e.preventDefault()
                  onLogout?.()
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
  )
}
