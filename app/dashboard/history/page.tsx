"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Search,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Filter,
  TrendingUp,
  Users,
  Archive,
  History,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SearchHistoryPage() {
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
      y: -2,
      transition: { duration: 0.2 },
    },
  };

  const searchHistory = [
    {
      id: 1,
      date: "April 11, 2025",
      time: "2:30 PM",
      results: 42,
      category: "Gaming",
      status: "completed",
      filters: ["English", "Fortnite", "1k+ followers"],
    },
    {
      id: 2,
      date: "April 10, 2025",
      time: "4:15 PM",
      results: 28,
      category: "Gaming",
      status: "completed",
      filters: ["Spanish", "Gaming", "500+ viewers"],
    },
    {
      id: 3,
      date: "April 8, 2025",
      time: "11:20 AM",
      results: 15,
      category: "Technology",
      status: "completed",
      filters: ["Tech", "Reviews", "10k+ followers"],
    },
    {
      id: 4,
      date: "April 6, 2025",
      time: "3:45 PM",
      results: 37,
      category: "Beauty",
      status: "completed",
      filters: ["Beauty", "Makeup", "5k+ followers"],
    },
    {
      id: 5,
      date: "April 5, 2025",
      time: "1:20 PM",
      results: 89,
      category: "Entertainment",
      status: "completed",
      filters: ["Just Chatting", "English", "2k+ followers"],
    },
    {
      id: 6,
      date: "April 3, 2025",
      time: "6:45 PM",
      results: 23,
      category: "Music",
      status: "completed",
      filters: ["Music", "Production", "Creative"],
    },
    {
      id: 7,
      date: "April 2, 2025",
      time: "3:15 PM",
      results: 56,
      category: "Gaming",
      status: "completed",
      filters: ["Valorant", "Competitive", "English"],
    },
    {
      id: 8,
      date: "April 1, 2025",
      time: "10:30 AM",
      results: 34,
      category: "Technology",
      status: "completed",
      filters: ["AI", "Programming", "Tutorials"],
    },
  ];

  const exportHistory = [
    {
      id: 1,
      filename: "English_Fortnite_Streamers.csv",
      date: "April 11, 2025",
      time: "2:35 PM",
      records: 42,
      size: "12KB",
      format: "CSV",
    },
    {
      id: 2,
      filename: "Spanish_Gaming_Channels.xlsx",
      date: "April 10, 2025",
      time: "4:20 PM",
      records: 28,
      size: "18KB",
      format: "Excel",
    },
    {
      id: 3,
      filename: "Tech_Reviewers.json",
      date: "April 8, 2025",
      time: "11:25 AM",
      records: 15,
      size: "8KB",
      format: "JSON",
    },
    {
      id: 4,
      filename: "Beauty_Influencers.csv",
      date: "April 6, 2025",
      time: "3:50 PM",
      records: 37,
      size: "20KB",
      format: "CSV",
    },
    {
      id: 5,
      filename: "Just_Chatting_Streamers.xlsx",
      date: "April 5, 2025",
      time: "1:25 PM",
      records: 89,
      size: "45KB",
      format: "Excel",
    },
    {
      id: 6,
      filename: "Music_Production_Creators.json",
      date: "April 3, 2025",
      time: "6:50 PM",
      records: 23,
      size: "15KB",
      format: "JSON",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "processing":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "failed":
        return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "csv":
        return "📊";
      case "excel":
        return "📈";
      case "json":
        return "🔧";
      default:
        return "📄";
    }
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-800">
            <Archive className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Search Archive
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Search History
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            View and manage your past searches and exported data. Track your
            discovery journey and analyze search patterns.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              title: "Total Searches",
              value: "127",
              icon: Search,
              color: "blue",
              change: "+12 this week",
            },
            {
              title: "Data Exports",
              value: "42",
              icon: Download,
              color: "green",
              change: "+8 this week",
            },
            {
              title: "Streamers Found",
              value: "2,543",
              icon: Users,
              color: "purple",
              change: "+234 this week",
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
                      : "from-purple-500 to-purple-600"
                  }`}
                />
                <CardContent className="p-4 sm:p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        stat.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : stat.color === "green"
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-purple-100 dark:bg-purple-900"
                      }`}
                    >
                      <stat.icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${
                          stat.color === "blue"
                            ? "text-blue-600 dark:text-blue-400"
                            : stat.color === "green"
                            ? "text-green-600 dark:text-green-400"
                            : "text-purple-600 dark:text-purple-400"
                        }`}
                      />
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {stat.title}
                    </h3>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                      {stat.value}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {stat.change}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="searches" className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-lg">
                <TabsTrigger
                  value="searches"
                  className="transition-all duration-300 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-200 data-[state=active]:shadow-md px-6 sm:px-8 py-3 rounded-lg font-semibold"
                >
                  <History className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Search History</span>
                  <span className="sm:hidden">Searches</span>
                </TabsTrigger>
                <TabsTrigger
                  value="exports"
                  className="transition-all duration-300 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 data-[state=active]:text-green-800 dark:data-[state=active]:text-green-200 data-[state=active]:shadow-md px-6 sm:px-8 py-3 rounded-lg font-semibold"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export History</span>
                  <span className="sm:hidden">Exports</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search History Tab */}
            <TabsContent value="searches" className="space-y-6">
              <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-800 dark:text-slate-100">
                        Search Records
                      </CardTitle>
                      <CardDescription>
                        Chronological view of your search activity and results
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-3">
                    {searchHistory.map((search, index) => (
                      <motion.div
                        key={search.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        variants={cardHoverVariants}
                        whileHover="hover"
                        className="group p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-600"
                      >
                        <div className="flex items-center gap-4">
                          {/* Unified Search Icon */}
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex-shrink-0">
                            <History className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>

                          {/* Search Information */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{search.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{search.time}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <Badge className={getStatusColor(search.status)}>
                                ✓ {search.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-slate-100 dark:bg-slate-800"
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                {search.results} results
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-slate-100 dark:bg-slate-800"
                              >
                                <Filter className="h-3 w-3 mr-1" />
                                {search.category}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {search.filters.map((filter, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800"
                                >
                                  {filter}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Load More Searches
                  </Button>
                </motion.div>
              </div>
            </TabsContent>

            {/* Export History Tab */}
            <TabsContent value="exports" className="space-y-6">
              <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                      <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-800 dark:text-slate-100">
                        Recent Exports
                      </CardTitle>
                      <CardDescription>
                        Your most recent data exports and downloads
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {exportHistory.map((export_, index) => (
                      <motion.div
                        key={export_.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        variants={cardHoverVariants}
                        whileHover="hover"
                        className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-600"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 flex-shrink-0">
                              <span className="text-lg">
                                {getFormatIcon(export_.format)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">
                                {export_.filename}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{export_.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{export_.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {export_.format}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-slate-100 dark:bg-slate-800"
                            >
                              <BarChart3 className="h-3 w-3 mr-1" />
                              {export_.records} records
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-slate-100 dark:bg-slate-800"
                            >
                              📦 {export_.size}
                            </Badge>
                          </div>

                          <div className="pt-2">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Load More Exports
                  </Button>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
