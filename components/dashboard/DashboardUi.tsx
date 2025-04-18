"use client";
import {
  ArrowUpRight,
  BarChart3,
  Clock,
  Link,
  Search,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import User from "../../app/types/user";
import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
// import { useUser } from "@/app/context/UserContext";
// interface DashboardUIProps {
//   user: User; // You will get the user prop from the server-side page
// }
export default function DashboardUi() {
    const user = useUser();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      // Only set mounted to true on the client
      setIsMounted(true);
    }, []);

    if (!isMounted) return null;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.first_name}! Here's an overview of your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Searches
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Streamers Found
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground">
              +10.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saved Searches
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Exports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Search Activity</CardTitle>
            <CardDescription>
              Your search activity over the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              Chart placeholder - would show search activity over time
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Searches</CardTitle>
            <CardDescription>Your most recent search queries.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    English Fortnite Streamers
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Link
                  href="/dashboard/twitch-scraper"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Spanish Gaming Channels</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <Link
                  href="/dashboard/twitch-scraper"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Tech Reviewers 10k+ Followers
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
                <Link
                  href="/dashboard/twitch-scraper"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Beauty Influencers</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
                <Link
                  href="/dashboard/twitch-scraper"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your current plan and usage.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Current Plan</p>
                <p className="text-sm">
                  {user?.is_subscribed ? "Premium" : "Free"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Search Limit</p>
                <p className="text-sm">
                  {user?.is_subscribed ? "Unlimited" : "10 results per search"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Export Limit</p>
                <p className="text-sm">
                  {user?.is_subscribed ? "Unlimited" : "100 per month"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Saved Searches</p>
                <p className="text-sm">
                  {user?.is_subscribed ? "Unlimited" : "5 max"}
                </p>
              </div>
              {!user?.is_subscribed && (
                <Link href="/dashboard/billing" className="block w-full">
                  <div className="bg-blue-50 text-blue-700 text-sm p-2 rounded-md text-center mt-2 hover:bg-blue-100 transition-colors">
                    Upgrade to Premium
                  </div>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>
              Most popular categories in your searches.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[220px] flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              Chart placeholder - would show category distribution
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>
              Languages of streamers in your searches.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[220px] flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              Chart placeholder - would show language distribution
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
