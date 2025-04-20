"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase-browser";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { refreshUser } = useUser();

  const handleAccountDelete = async () => {
    const supabase = createClient();

    setIsLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Failed to get user", userError);
      setIsLoading(false);
      return;
    }

    console.log("Deleting user with ID:", user.id);

    const res = await fetch("/api/delete-account", {
      method: "POST",
      body: JSON.stringify({ user_id: user.id }),
    });

    if (!res.ok) {
      console.error("Failed to delete user data");
      setIsLoading(false);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("Failed to sign out", signOutError);
      setIsLoading(false);
      return;
    }

    router.replace("/goodbye");
    refreshUser();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription>
          This is a demo interface. Settings changes will not be persisted.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure your general application settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable dark mode for the application interface.
              </p>
            </div>
            <Switch id="dark-mode" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Browser Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser.
              </p>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="utc">
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">Eastern Time (ET)</SelectItem>
                <SelectItem value="cst">Central Time (CT)</SelectItem>
                <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                <SelectItem value="pst">Pacific Time (PT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Settings</CardTitle>
          <CardDescription>Configure how your data is handled.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto-Save Searches</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save your search history.
              </p>
            </div>
            <Switch id="auto-save" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics">Usage Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Allow us to collect anonymous usage data to improve the service.
              </p>
            </div>
            <Switch id="analytics" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="export-format">Default Export Format</Label>
            <Select defaultValue="csv">
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Clear All Data</h3>
            <p className="text-sm text-muted-foreground">
              This will permanently delete all your saved searches, history, and
              preferences.
            </p>
            <Button variant="destructive">Clear All Data</Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              This will permanently delete your account and all associated data.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. It will permanently delete
                    your account and remove all of your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleAccountDelete}
                  >
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
