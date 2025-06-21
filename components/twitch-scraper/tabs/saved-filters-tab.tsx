"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useUser } from "@/app/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Filter,
  Calendar,
  MoreHorizontal,
  Trash2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

interface SavedFilter {
  id: string;
  user_id: string;
  name: string;
  language: string | null;
  min_followers: number;
  max_followers: number;
  min_viewers: number;
  max_viewers: number;
  category: string | null;
  created_at: string;
}

interface SavedFiltersTabProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => Promise<void>;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setMinFollowers: React.Dispatch<React.SetStateAction<number>>;
  setMaxFollowers: React.Dispatch<React.SetStateAction<number>>;
  setMinViewers: React.Dispatch<React.SetStateAction<number>>;
  setMaxViewers: React.Dispatch<React.SetStateAction<number>>;
  setRunSearchOnTab: React.Dispatch<React.SetStateAction<boolean>>;
  language: string;
  category: string;
  minFollowers: number;
  maxFollowers: number;
  minViewers: number;
  maxViewers: number;
}

export default function SavedFiltersTab({
  setActiveTab,
  setLanguage,
  setCategory,
  setMinFollowers,
  setMaxFollowers,
  setMinViewers,
  setMaxViewers,
  setRunSearchOnTab,
}: SavedFiltersTabProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) {
      fetchSavedFilters();
    } else {
      setIsLoading(false);
      setSavedFilters([]);
    }
  }, [user]);

  const fetchSavedFilters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}filters?user_id=${user?.id}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved filters");
      }

      const data = await response.json();
      setSavedFilters(data);
    } catch (error) {
      console.error("Error fetching saved filters:", error);
      setError("Failed to load saved filters. Please try again.");
      toast.error("Failed to Load Filters", {
        description:
          "Unable to fetch your saved filters. Please check your connection and try again.",
        icon: <XCircle className="h-5 w-5" />,
        action: {
          label: "Retry",
          onClick: () => fetchSavedFilters(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runSavedFilter = (filter: SavedFilter) => {
    setLanguage(filter.language || "");
    setCategory(filter.category || "");
    setMinFollowers(filter.min_followers);
    setMaxFollowers(filter.max_followers);
    setMinViewers(filter.min_viewers);
    setMaxViewers(filter.max_viewers);

    setActiveTab("search");
    setRunSearchOnTab(true);

    toast.success("Filter Applied Successfully", {
      description: `Running search with "${filter.name}" filter settings.`,
      icon: <Search className="h-5 w-5" />,
    });
  };

  const deleteFilter = async () => {
    if (!deleteId) return;

    const filterToDelete = savedFilters.find((f) => f.id === deleteId);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        headers["x-user-id"] = user.id;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}filters/${deleteId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete filter");
      }

      setSavedFilters(savedFilters.filter((filter) => filter.id !== deleteId));

      toast.success("Filter Deleted Successfully", {
        description: `The filter "${filterToDelete?.name}" has been permanently removed from your saved filters.`,
        icon: <CheckCircle className="h-5 w-5" />,
      });
    } catch (error) {
      console.error("Error deleting filter:", error);
      toast.error("Failed to Delete Filter", {
        description: "Unable to delete the filter. Please try again later.",
        icon: <XCircle className="h-5 w-5" />,
        action: {
          label: "Retry",
          onClick: () => deleteFilter(),
        },
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-blue-100 shadow-lg overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="mb-6"
            >
              <RefreshCw className="h-12 w-12 text-blue-500" />
            </motion.div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading saved filters...
            </h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-red-100 shadow-lg overflow-hidden bg-gradient-to-br from-white to-red-50/30">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-full border-2 border-red-200 mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-700 mb-3">
              Error loading filters
            </h3>
            <p className="text-red-600 mb-6 text-center">{error}</p>
            <Button
              onClick={fetchSavedFilters}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (savedFilters.length === 0) {
    return (
      <Card className="border-2 border-blue-100 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-6">
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-full inline-block mx-auto border-2 border-blue-100"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Filter className="h-12 w-12 text-blue-500" />
            </motion.div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              No saved filters yet
            </h3>
            <p className="text-gray-600 max-w-md leading-relaxed">
              Save your search filters to quickly access them later. Create
              custom filter combinations and reuse them whenever you need.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {savedFilters.map((filter) => (
            <motion.div
              key={filter.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.8 }}
              className="group"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full flex flex-col transition-all duration-300 border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl bg-gradient-to-br from-white to-blue-50/30 group-hover:shadow-blue-100/50">
                <CardHeader className="pb-3 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent group-hover:from-blue-800 group-hover:to-purple-800 transition-all">
                        {filter.name}
                      </CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-blue-100"
                      >
                        <DropdownMenuLabel className="text-blue-700">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => runSavedFilter(filter)}
                          className="hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Run Filter
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setIsDeleting(true);
                            setDeleteId(filter.id);
                          }}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-grow">
                  <div className="space-y-4">
                    <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(filter.created_at).toLocaleDateString()}
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        Filter Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="font-semibold text-blue-600">
                            Language:
                          </span>
                          <div className="text-gray-700 bg-white px-2 py-1 rounded border">
                            {filter.language || "Any"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-blue-600">
                            Category:
                          </span>
                          <div className="text-gray-700 bg-white px-2 py-1 rounded border">
                            {filter.category || "Any"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-blue-600">
                            Followers:
                          </span>
                          <div className="text-gray-700 bg-white px-2 py-1 rounded border">
                            {filter.min_followers.toLocaleString()} -{" "}
                            {filter.max_followers.toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-blue-600">
                            Viewers:
                          </span>
                          <div className="text-gray-700 bg-white px-2 py-1 rounded border">
                            {filter.min_viewers.toLocaleString()} -{" "}
                            {filter.max_viewers.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="mt-auto"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => runSavedFilter(filter)}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Run Filter
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="border-red-100">
          <DialogHeader>
            <DialogTitle className="text-red-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Delete Filter
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this filter? This action cannot be
              undone and you'll lose all the saved filter settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleting(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteFilter}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Delete Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
