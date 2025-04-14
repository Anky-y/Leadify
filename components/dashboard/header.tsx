"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { logout } from "@/app/auth"
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type User from "../../app/types/user";
import {  logout } from "../../lib/utils/auth";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/context/UserContext"; // interface DashboardUIProps {
//   user: User; // You will get the user prop from the server-side page
// }

export default function DashboardHeader() {
  const { setSession, setUser, user } = useUserContext()!;
  const router = useRouter();
  console.log(user);
  if (!user) {
    return <div>Loading...</div>;
  }
  const initials = user?.first_name;

  console.log(initials);

  const handleLogout = async () => {
    await logout();
    setSession(null);
    setUser(null);
    router.push("/login");
  };
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="hidden md:block">
          {/* Empty div to maintain spacing */}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-blue-600"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/help">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Link>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${user.id}`}
                    alt={user.first_name}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.first_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  {user.is_subscribed ? (
                    <Badge className="mt-1 w-fit bg-blue-700">
                      Premium Plan
                    </Badge>
                  ) : (
                    <Badge className="mt-1 w-fit" variant="outline">
                      Free Plan
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
