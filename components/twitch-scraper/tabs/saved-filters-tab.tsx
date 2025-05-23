"use client";

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
} from "lucide-react";

// Define the saved filter type based on the database schema
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
  language: string;
  category: string;
  minFollowers: number;
  maxFollowers: number;
  minViewers: number;
  maxViewers: number;
  // Add other props as needed
}

export default function SavedFiltersTab({
  setActiveTab,
  handleSearch,
  setLanguage,
  setCategory,
  setMinFollowers,
  setMaxFollowers,
  setMinViewers,
  setMaxViewers,
}: SavedFiltersTabProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { user } = useUser();

  // Fetch saved filters when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchSavedFilters();
    } else {
      setIsLoading(false);
      setSavedFilters([]);
    }
  }, [user]);

  // Function to fetch saved filters from the database
  const fetchSavedFilters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle running a saved filter
  const runSavedFilter = (filter: SavedFilter) => {
    // Apply the filter settings
    setLanguage(filter.language || "");
    setCategory(filter.category || "");
    setMinFollowers(filter.min_followers);
    setMaxFollowers(filter.max_followers);
    setMinViewers(filter.min_viewers);
    setMaxViewers(filter.max_viewers);

    // Switch to search tab and run the search
    setActiveTab("search");

    // Small delay to ensure the tab switch happens before the search
    setTimeout(() => {
      handleSearch();
    }, 100);

    toast.success(`Running search with "${filter.name}" filter`);
  };

  // Function to delete a saved filter
  const deleteFilter = async () => {
    if (!deleteId) return;

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

      // Remove the deleted filter from the state
      setSavedFilters(savedFilters.filter((filter) => filter.id !== deleteId));

      toast.success("The filter has been removed from your saved filters");
    } catch (error) {
      console.error("Error deleting filter:", error);
      toast.error("Failed to delete filter. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card className="border border-blue-100 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium mt-2 text-gray-800">
              Loading saved filters...
            </h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="border border-red-100 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mt-2 text-gray-800">
              Error loading filters
            </h3>
            <p className="text-gray-500 mt-2">{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={fetchSavedFilters}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render empty state
  if (savedFilters.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="bg-blue-50 p-4 rounded-full inline-block mx-auto">
              <Filter className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mt-4">No saved filters</h3>
            <p className="text-gray-500 max-w-md">
              Save your search filters to quickly access them later. Your saved
              filters will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render saved filters
  return (
    <div className="space-y-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {savedFilters.map((filter) => (
            <motion.div
              key={filter.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.8 }}
              className="group"
            >
              <Card className="h-full border border-gray-200 hover:border-blue-200 transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-blue-800 group-hover:text-blue-700 transition-colors">
                      {filter.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => runSavedFilter(filter)}
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
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(filter.created_at).toLocaleDateString()}
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-xs font-medium text-gray-700 mb-2">
                        Filter Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Language:</span>{" "}
                          {filter.language || "Any"}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>{" "}
                          {filter.category || "Any"}
                        </div>
                        <div>
                          <span className="font-medium">Followers:</span>{" "}
                          {filter.min_followers.toLocaleString()} -{" "}
                          {filter.max_followers.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Viewers:</span>{" "}
                          {filter.min_viewers.toLocaleString()} -{" "}
                          {filter.max_viewers.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="mt-2"
                    >
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => runSavedFilter(filter)}
                      >
                        <Play className="h-4 w-4 mr-2" />
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

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Filter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this filter? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteFilter}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
