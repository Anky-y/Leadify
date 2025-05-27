"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Users, Search, Clock } from "lucide-react";

export function DashboardContent() {
  return (
    <div className="space-y-6 p-4 ">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your Leadify account and recent activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-200 hover:shadow-md">
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

        <Card className="transition-all duration-200 hover:shadow-md">
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

        <Card className="transition-all duration-200 hover:shadow-md">
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

        <Card className="transition-all duration-200 hover:shadow-md">
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest searches and exports</CardDescription>
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
                <div className="text-xs text-muted-foreground">127 results</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Spanish Gaming Channels</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div className="text-xs text-muted-foreground">89 results</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Tech Reviewers 10k+ Followers
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
                <div className="text-xs text-muted-foreground">234 results</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your current plan and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Current Plan</p>
                <p className="text-sm">Pro Plan</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Search Limit</p>
                <p className="text-sm">Unlimited</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Export Limit</p>
                <p className="text-sm">Unlimited</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Credits Remaining</p>
                <p className="text-sm font-bold text-blue-600">142</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
