"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/app/context/UserContext";
import Spinner from "@/components/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateName } from "@/utils/userActions";
import { createClient } from "@/utils/supabase-browser";
import { motion } from "framer-motion";
import {
  UserIcon,
  Mail,
  Building,
  Lock,
  Shield,
  Bell,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading } = useUser();
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [company, setCompany] = useState("Acme Inc.");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    marketing: true,
    account: true,
    security: true,
  });

  const supabase = createClient();

  useEffect(() => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
  }, [user]);

  if (userLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <div>Error: User not found</div>;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateName({ firstName, lastName });

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Your profile has been updated successfully.");
    }
    setLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Invalid current password");
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error("Could not update password.");
      } else {
        toast.success("Your password has been updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
            <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Profile Management
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Manage your account settings and profile information to personalize
            your experience.
          </p>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
          <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <CardContent className="p-6 sm:p-8 relative">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white dark:border-slate-700 shadow-lg">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${user.id}`}
                      alt="User"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl sm:text-2xl font-bold">
                      {user?.first_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {`${user?.first_name || ""} ${
                      user?.last_name || ""
                    }`.trim() || "User"}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Active Account
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-lg">
                <TabsTrigger
                  value="general"
                  className="transition-all duration-300 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-200 data-[state=active]:shadow-md px-4 sm:px-6 py-3 rounded-lg font-semibold"
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="transition-all duration-300 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200 data-[state=active]:shadow-md px-4 sm:px-6 py-3 rounded-lg font-semibold"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="transition-all duration-300 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 data-[state=active]:text-green-800 dark:data-[state=active]:text-green-200 data-[state=active]:shadow-md px-4 sm:px-6 py-3 rounded-lg font-semibold"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid gap-6 lg:gap-8 grid-cols-1">
                {/* Personal Information */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                  <form onSubmit={handleProfileUpdate}>
                    <CardHeader className="relative">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                          <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-slate-800 dark:text-slate-100">
                            Personal Information
                          </CardTitle>
                          <CardDescription>
                            Update your personal details and contact information
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 relative">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label
                            htmlFor="first-name"
                            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                          >
                            First Name
                          </Label>
                          <Input
                            id="first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                            placeholder="Enter your first name"
                          />
                        </motion.div>
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label
                            htmlFor="last-name"
                            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                          >
                            Last Name
                          </Label>
                          <Input
                            id="last-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                            placeholder="Enter your last name"
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        className="space-y-2"
                        whileFocus={{ scale: 1.02 }}
                      >
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                        >
                          Email Address
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative">
                                <Input
                                  id="email"
                                  type="email"
                                  defaultValue={user?.email}
                                  disabled
                                  className="cursor-help border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 pl-10"
                                />
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              align="start"
                              sideOffset={8}
                            >
                              <p>
                                Email address cannot be changed at this time
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        whileFocus={{ scale: 1.02 }}
                      >
                        <Label
                          htmlFor="company"
                          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                        >
                          Company
                        </Label>
                        <div className="relative">
                          <Input
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors pl-10"
                            placeholder="Enter your company name"
                          />
                          <Building className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        </div>
                      </motion.div>
                    </CardContent>
                    <CardFooter className="relative">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </form>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
                {/* Password Update */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden lg:col-span-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
                  <form onSubmit={handlePasswordUpdate}>
                    <CardHeader className="relative">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                          <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-slate-800 dark:text-slate-100">
                            Password Security
                          </CardTitle>
                          <CardDescription>
                            Update your password to keep your account secure
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label
                            htmlFor="current-password"
                            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                          >
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showCurrentPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                              className="border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors pr-10"
                              placeholder="Enter your current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label
                            htmlFor="new-password"
                            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                          >
                            New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors pr-10"
                              placeholder="Enter your new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label
                            htmlFor="confirm-password"
                            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                          >
                            Confirm New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 transition-colors pr-10"
                              placeholder="Confirm your new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                    </CardContent>
                    <CardFooter className="relative">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </form>
                </Card>

                {/* Two-Factor Authentication */}
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden lg:col-span-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-slate-800 dark:text-slate-100">
                          Two-Factor Authentication
                        </CardTitle>
                        <CardDescription>
                          Add an extra layer of security to your account
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <motion.div
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 gap-4"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                          <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Add an extra layer of security to your account by
                            enabling two-factor authentication
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950 flex-shrink-0"
                      >
                        Enable 2FA
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                      <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-800 dark:text-slate-100">
                        Email Notifications
                      </CardTitle>
                      <CardDescription>
                        Manage your email notification preferences
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Marketing Emails */}
                    <motion.div
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                            Marketing Emails
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Receive emails about new features, tips, and
                            promotions
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            marketing: checked,
                          }))
                        }
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </motion.div>

                    {/* Account Notifications */}
                    <motion.div
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                          <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                            Account Notifications
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Receive emails about your account activity and
                            security
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.account}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            account: checked,
                          }))
                        }
                        className="data-[state=checked]:bg-green-600"
                      />
                    </motion.div>

                    {/* Security Alerts */}
                    <motion.div
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                          <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                            Security Alerts
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Receive important security notifications and alerts
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.security}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            security: checked,
                          }))
                        }
                        className="data-[state=checked]:bg-red-600"
                      />
                    </motion.div>
                  </div>
                </CardContent>
                <CardFooter className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() =>
                        toast.success("Notification preferences saved!")
                      }
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
