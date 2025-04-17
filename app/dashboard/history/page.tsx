import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scrape History | Leadify",
  description: "View your scrape history and past searches.",
};

export default async function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scrape History</h1>
        <p className="text-muted-foreground">
          View and manage your past searches and exported data.
        </p>
      </div>

      <Tabs defaultValue="searches">
        <TabsList>
          <TabsTrigger value="searches">Search History</TabsTrigger>
          <TabsTrigger value="exports">Export History</TabsTrigger>
        </TabsList>

        <TabsContent value="searches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Searches</CardTitle>
              <CardDescription>
                Your most recent search queries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        English Fortnite Streamers
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      April 11, 2025 • 2:30 PM
                    </p>
                    <p className="text-sm">42 results</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Link href="/dashboard/twitch-scraper">
                      <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800"
                      >
                        Run Again
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Spanish Gaming Channels
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      April 10, 2025 • 4:15 PM
                    </p>
                    <p className="text-sm">28 results</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Link href="/dashboard/twitch-scraper">
                      <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800"
                      >
                        Run Again
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Tech Reviewers 10k+ Followers
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      April 8, 2025 • 11:20 AM
                    </p>
                    <p className="text-sm">15 results</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Link href="/dashboard/twitch-scraper">
                      <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800"
                      >
                        Run Again
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Beauty Influencers</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      April 6, 2025 • 3:45 PM
                    </p>
                    <p className="text-sm">37 results</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Link href="/dashboard/twitch-scraper">
                      <Button
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800"
                      >
                        Run Again
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>Your most recent data exports.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        English_Fortnite_Streamers.csv
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      April 11, 2025 • 2:35 PM
                    </p>
                    <p className="text-sm">42 records • 12KB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Spanish_Gaming_Channels.xlsx
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      April 10, 2025 • 4:20 PM
                    </p>
                    <p className="text-sm">28 records • 18KB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Tech_Reviewers.json</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      April 8, 2025 • 11:25 AM
                    </p>
                    <p className="text-sm">15 records • 8KB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        Beauty_Influencers.csv
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      April 6, 2025 • 3:50 PM
                    </p>
                    <p className="text-sm">37 records • 20KB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
