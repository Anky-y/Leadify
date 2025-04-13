import type { Metadata } from "next";
import { requireAuth } from "@/app/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  FileSpreadsheet,
  Mail,
  Database,
  FileText,
  Calendar,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Integrations | Leadify",
  description: "Connect Leadify with your favorite tools and services.",
};

export default async function IntegrationsPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect Leadify with your favorite tools and services.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription>
          This is a demo interface. In a real application, you would be able to
          connect to these services.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded">
                  <FileSpreadsheet className="h-6 w-6 text-green-700" />
                </div>
                <CardTitle>Google Sheets</CardTitle>
              </div>
              <CardDescription className="mt-1">
                Export data directly to Google Sheets
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
            >
              Connected
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automatically export your search results to Google Sheets. Create
              new sheets or update existing ones with your latest data.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Connection
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded">
                  <Mail className="h-6 w-6 text-blue-700" />
                </div>
                <CardTitle>Gmail</CardTitle>
              </div>
              <CardDescription className="mt-1">
                Send outreach emails directly from Leadify
              </CardDescription>
            </div>
            <Badge variant="outline">Not Connected</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect your Gmail account to send personalized outreach emails to
              content creators directly from Leadify.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-700 hover:bg-blue-800">
              Connect
            </Button>
          </CardFooter>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded">
                  <Database className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>Airtable</CardTitle>
              </div>
              <CardDescription className="mt-1">Sync data with your Airtable bases</CardDescription>
            </div>
            <Badge variant="outline">Not Connected</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sync your Leadify data with Airtable to create custom workflows and manage your outreach campaigns.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-700 hover:bg-blue-800">Connect</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded">
                  <FileText className="h-6 w-6 text-blue-700" />
                </div>
                <CardTitle>Notion</CardTitle>
              </div>
              <CardDescription className="mt-1">Export data to Notion databases</CardDescription>
            </div>
            <Badge variant="outline">Not Connected</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Export your search results to Notion databases to organize your outreach efforts and collaborate with your
              team.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-700 hover:bg-blue-800">Connect</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded">
                  <Calendar className="h-6 w-6 text-amber-700" />
                </div>
                <CardTitle>Google Calendar</CardTitle>
              </div>
              <CardDescription className="mt-1">Schedule outreach and follow-ups</CardDescription>
            </div>
            <Badge variant="outline">Not Connected</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect your Google Calendar to schedule outreach calls and follow-ups with content creators.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-700 hover:bg-blue-800">Connect</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.5 12.5C19.5 16.6421 16.1421 20 12 20C7.85786 20 4.5 16.6421 4.5 12.5C4.5 8.35786 7.85786 5 12 5C16.1421 5 19.5 8.35786 19.5 12.5Z"
                      stroke="#4F46E5"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 8V13L15 15"
                      stroke="#4F46E5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <CardTitle>Zapier</CardTitle>
              </div>
              <CardDescription className="mt-1">Connect with 3,000+ apps</CardDescription>
            </div>
            <Badge variant="outline">Not Connected</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use Zapier to connect Leadify with thousands of other apps and automate your workflows.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-700 hover:bg-blue-800">Connect</Button>
          </CardFooter>
        </Card> */}
      </div>
    </div>
  );
}
