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
import {
  AlertCircle,
  SettingsIcon,
  Moon,
  Bell,
  Globe,
  Clock,
  Database,
  BarChart3,
  FileText,
  Trash2,
  Shield,
  Save,
} from "lucide-react";
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
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    language: "en",
    timezone: "utc",
    autoSave: true,
    analytics: true,
    exportFormat: "csv",
  });
  const router = useRouter();
  const { refreshUser } = useUser();

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully!");
    setIsLoading(false);
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 space-y-8">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center space-y-4 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800">
            <SettingsIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Application Settings
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Manage your application settings and preferences to customize your
            experience.
          </p>
        </motion.div>

        {/* Demo Alert */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <Alert className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">
              Demo Mode
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              This is a demo interface. Settings changes will be simulated for
              demonstration purposes.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Main Settings Grid */}
        <div className="grid gap-6 lg:gap-8 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
          {/* General Settings */}
          <motion.div
            variants={itemVariants}
            className="xl:col-span-1 2xl:col-span-1"
          >
            <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <SettingsIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-800 dark:text-slate-100">
                      General Settings
                    </CardTitle>
                    <CardDescription>
                      Configure your general application settings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                {/* Dark Mode */}
                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-600">
                      <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="dark-mode"
                        className="text-base font-medium"
                      >
                        Dark Mode
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Enable dark mode for the application interface
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange("darkMode", checked)
                    }
                    className="data-[state=checked]:bg-blue-600"
                  />
                </motion.div>

                {/* Notifications */}
                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                      <Bell className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="notifications"
                        className="text-base font-medium"
                      >
                        Browser Notifications
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive notifications in your browser
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifications", checked)
                    }
                    className="data-[state=checked]:bg-green-600"
                  />
                </motion.div>

                {/* Language */}
                <motion.div
                  className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Label htmlFor="language" className="text-base font-medium">
                      Language
                    </Label>
                  </div>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      handleSettingChange("language", value)
                    }
                  >
                    <SelectTrigger
                      id="language"
                      className="border-slate-300 dark:border-slate-600"
                    >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="fr">🇫🇷 French</SelectItem>
                      <SelectItem value="de">🇩🇪 German</SelectItem>
                      <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Timezone */}
                <motion.div
                  className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <Label htmlFor="timezone" className="text-base font-medium">
                      Timezone
                    </Label>
                  </div>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) =>
                      handleSettingChange("timezone", value)
                    }
                  >
                    <SelectTrigger
                      id="timezone"
                      className="border-slate-300 dark:border-slate-600"
                    >
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">🌍 UTC</SelectItem>
                      <SelectItem value="est">🇺🇸 Eastern Time (ET)</SelectItem>
                      <SelectItem value="cst">🇺🇸 Central Time (CT)</SelectItem>
                      <SelectItem value="mst">🇺🇸 Mountain Time (MT)</SelectItem>
                      <SelectItem value="pst">🇺🇸 Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </CardContent>
              <CardFooter className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Data Settings */}
          <motion.div
            variants={itemVariants}
            className="xl:col-span-1 2xl:col-span-1"
          >
            <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-800 dark:text-slate-100">
                      Data Settings
                    </CardTitle>
                    <CardDescription>
                      Configure how your data is handled
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                {/* Auto-Save */}
                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Save className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="auto-save"
                        className="text-base font-medium"
                      >
                        Auto-Save Searches
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Automatically save your search history
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoSave", checked)
                    }
                    className="data-[state=checked]:bg-blue-600"
                  />
                </motion.div>

                {/* Analytics */}
                <motion.div
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="analytics"
                        className="text-base font-medium"
                      >
                        Usage Analytics
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Allow us to collect anonymous usage data to improve the
                        service
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.analytics}
                    onCheckedChange={(checked) =>
                      handleSettingChange("analytics", checked)
                    }
                    className="data-[state=checked]:bg-purple-600"
                  />
                </motion.div>

                {/* Export Format */}
                <motion.div
                  className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                      <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <Label
                      htmlFor="export-format"
                      className="text-base font-medium"
                    >
                      Default Export Format
                    </Label>
                  </div>
                  <Select
                    value={settings.exportFormat}
                    onValueChange={(value) =>
                      handleSettingChange("exportFormat", value)
                    }
                  >
                    <SelectTrigger
                      id="export-format"
                      className="border-slate-300 dark:border-slate-600"
                    >
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">📊 CSV</SelectItem>
                      <SelectItem value="excel">📈 Excel</SelectItem>
                      <SelectItem value="json">🔧 JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </CardContent>
              <CardFooter className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            variants={itemVariants}
            className="xl:col-span-2 2xl:col-span-1"
          >
            <Card className="border-2 border-red-200 dark:border-red-800 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                    <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-red-800 dark:text-red-200">
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible actions for your account
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                {/* Clear Data */}
                <motion.div
                  className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-red-800 dark:text-red-200">
                        Clear All Data
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        This will permanently delete all your saved searches,
                        history, and preferences.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="sm:ml-4 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Data
                    </Button>
                  </div>
                </motion.div>

                {/* Delete Account */}
                <motion.div
                  className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-red-800 dark:text-red-200">
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        This will permanently delete your account and all
                        associated data.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="sm:ml-4 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-red-200 dark:border-red-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-800 dark:text-red-200">
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. It will permanently
                            delete your account and remove all of your data from
                            our servers.
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
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
