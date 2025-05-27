"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Search,
  Clock,
  TrendingUp,
  Zap,
  CreditCard,
  Settings,
  ArrowRight,
  Activity,
  Calendar,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Animated counter component
function AnimatedCounter({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

export function DashboardContent() {
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

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -4,
      transition: { duration: 0.2 },
    },
  };

  const quickActions = [
    {
      title: "Twitch Scraper",
      description: "Find and analyze streamers",
      icon: Search,
      href: "/dashboard/twitch-scraper",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Billing & Credits",
      description: "Manage your subscription",
      icon: CreditCard,
      href: "/dashboard/billing",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Settings",
      description: "Configure preferences",
      icon: Settings,
      href: "/dashboard/settings",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 space-y-8">
        {/* Welcome Header */}
        <motion.div
          variants={itemVariants}
          className="text-center space-y-4 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Dashboard Overview
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Here's an overview of your Leadify account and recent activity.
            Ready to discover more streamers?
          </p>
        </motion.div>

        {/* Stats Grid - Responsive from 1 to 4 columns */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            {
              title: "Total Searches",
              value: 127,
              change: "+5.2%",
              icon: Search,
              color: "blue",
            },
            {
              title: "Streamers Found",
              value: 2543,
              change: "+10.1%",
              icon: Users,
              color: "green",
            },
            {
              title: "Saved Searches",
              value: 8,
              change: "+2",
              icon: Clock,
              color: "purple",
            },
            {
              title: "Data Exports",
              value: 42,
              change: "+12.5%",
              icon: BarChart3,
              color: "orange",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={cardHoverVariants}
              whileHover="hover"
              className="group"
            >
              <Card className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${
                    stat.color === "blue"
                      ? "from-blue-500 to-blue-600"
                      : stat.color === "green"
                      ? "from-green-500 to-green-600"
                      : stat.color === "purple"
                      ? "from-purple-500 to-purple-600"
                      : "from-orange-500 to-orange-600"
                  }`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-2 rounded-lg ${
                      stat.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : stat.color === "green"
                        ? "bg-green-100 dark:bg-green-900"
                        : stat.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900"
                        : "bg-orange-100 dark:bg-orange-900"
                    }`}
                  >
                    <stat.icon
                      className={`h-4 w-4 ${
                        stat.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : stat.color === "green"
                          ? "text-green-600 dark:text-green-400"
                          : stat.color === "purple"
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {stat.change} from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid - Responsive layout */}
        <div className="grid gap-6 lg:gap-8 grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4">
          {/* Quick Actions - Takes full width on mobile, 2 columns on xl, 1 column on 2xl */}
          <motion.div
            variants={itemVariants}
            className="xl:col-span-2 2xl:col-span-1 space-y-6"
          >
            <div className="text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Quick Actions
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Jump into your most used features
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-1">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  variants={cardHoverVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={action.href}>
                    <Card
                      className={`relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${action.bgColor} h-full`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                      />
                      <CardContent className="p-4 sm:p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}
                          >
                            <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-200 group-hover:translate-x-1 transform" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                          {action.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          {action.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity - Flexible width */}
          <motion.div
            variants={itemVariants}
            className="xl:col-span-1 2xl:col-span-2"
          >
            <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-800 dark:text-slate-100">
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your latest searches and exports
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "English Fortnite Streamers",
                      time: "2 hours ago",
                      results: 127,
                      status: "completed",
                    },
                    {
                      name: "Spanish Gaming Channels",
                      time: "Yesterday",
                      results: 89,
                      status: "completed",
                    },
                    {
                      name: "Tech Reviewers 10k+ Followers",
                      time: "3 days ago",
                      results: 234,
                      status: "completed",
                    },
                    {
                      name: "Beauty Content Creators",
                      time: "1 week ago",
                      results: 156,
                      status: "completed",
                    },
                  ].map((activity, index) => (
                    <motion.div
                      key={activity.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                            {activity.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-slate-500 flex-shrink-0" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 flex-shrink-0 ml-2"
                      >
                        {activity.results}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Overview - Flexible width */}
          <motion.div
            variants={itemVariants}
            className="xl:col-span-3 2xl:col-span-1"
          >
            <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-800 dark:text-slate-100">
                      Account Overview
                    </CardTitle>
                    <CardDescription>
                      Your current plan and usage
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Current Plan", value: "Pro Plan", icon: "✨" },
                    { label: "Search Limit", value: "Unlimited", icon: "🔍" },
                    { label: "Export Limit", value: "Unlimited", icon: "📊" },
                    {
                      label: "Credits Remaining",
                      value: "142",
                      icon: "⚡",
                      highlight: true,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {item.label}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-bold ${
                          item.highlight
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {item.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/dashboard/billing">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Zap className="h-4 w-4 mr-2" />
                      Manage Billing
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
