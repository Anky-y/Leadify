"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FilterSection from "../filter-section";
import TwitchDataTable from "../twitch-data-table";
import type { ScrapingProgress, TwitchData } from "../types";
import { AnimatePresence, motion } from "framer-motion";

interface SearchTabProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  minFollowers: number;
  setMinFollowers: (value: number) => void;
  maxFollowers: number;
  setMaxFollowers: (value: number) => void;
  minViewers: number;
  setMinViewers: (value: number) => void;
  maxViewers: number;
  setMaxViewers: (value: number) => void;
  isLoading: boolean;
  loadingProgress: number;
  data: TwitchData[];
  subscribed: boolean;
  setSubscribed: (value: boolean) => void;
  initialSubscribed: boolean;
  handleSearch: () => void;
  progressData: ScrapingProgress | null | undefined;
  streamers: TwitchData[];
  loadingStreamers: boolean;
}

export default function SearchTab({
  searchTerm,
  setSearchTerm,
  language,
  setLanguage,
  category,
  setCategory,
  minFollowers,
  setMinFollowers,
  maxFollowers,
  setMaxFollowers,
  minViewers,
  setMinViewers,
  maxViewers,
  setMaxViewers,
  isLoading,
  data,
  subscribed,
  setSubscribed,
  initialSubscribed,
  handleSearch,
  progressData,
  streamers,
  loadingStreamers,
}: SearchTabProps) {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    let count = 0;
    if (language && language !== "any") count++;
    if (category && category !== "any") count++;
    if (minFollowers > 1000) count++;
    if (maxFollowers < 10000000) count++;
    if (minViewers > 10) count++;
    if (maxViewers < 100000) count++;
    setActiveFiltersCount(count);
  }, [language, category, minFollowers, maxFollowers, minViewers, maxViewers]);

  const resetFilters = () => {
    setLanguage("");
    setCategory("");
    setMinFollowers(1000);
    setMaxFollowers(10000000);
    setMinViewers(10);
    setMaxViewers(100000);
  };

  const toggleFilterCollapse = () => {
    setIsFilterCollapsed(!isFilterCollapsed);
  };

  const stageConfig = [
    {
      name: "Initializing",
      description: "Setting up the scraping process.",
      showRate: false,
      showETA: false,
      showStreamers: false,
      showCompleted: false,
      showPercentage: false,
      showRatio: false,
      showFoundStreamerNumber: false,
      showFoundTotalStreamerNumber: false,
    },
    {
      name: "Collecting Live Streamers",
      description: "Finding live Twitch streamers",
      showRate: false,
      showETA: false,
      showStreamers: false,
      showCompleted: false,
      showPercentage: false,
      showRatio: false,
      showFoundTotalStreamerNumber: true,
      showFoundStreamerNumber: false,
    },
    {
      name: "Filtering Streamers",
      description: "Filtering streamers based on your criteria.",
      showRate: false,
      showETA: true,
      showStreamers: true,
      showCompleted: false,
      showPercentage: true,
      showRatio: false,
      showFoundTotalStreamerNumber: false,
      showFoundStreamerNumber: true,
    },
    {
      name: "Getting Socials",
      description: "Retrieving social media links for streamers.",
      showRate: true,
      showETA: true,
      showStreamers: true,
      showCompleted: true,
      showPercentage: true,
      showRatio: true,
      showFoundStreamerNumber: false,
      showFoundTotalStreamerNumber: false,
    },
    {
      name: "Finalizing",
      description: "Uploading and saving the results.",
      showRate: false,
      showETA: false,
      showStreamers: true,
      showCompleted: true,
      showPercentage: false,
      showRatio: false,
      showFoundStreamerNumber: false,
      showFoundTotalStreamerNumber: false,
    },
  ];

  const getStatusMessage = () => {
    if (!isLoading || !progressData) return "Ready to search";

    const currentStage = stageConfig[progressData.Stage];
    if (!currentStage) return "Processing...";

    if (currentStage.name === "1") {
      return currentStage.name;
    } else if (currentStage.name === "2") {
      return `Collecting all live streamers in your category...`;
    } else if (currentStage.name === "3") {
      return `Filtering streamers based on your criteria...`;
    } else if (currentStage.name === "4") {
      return `Retrieving social media links for ${progressData.Streamers} streamers...`;
    } else if (currentStage.name === "5") {
      return `Uploading and saving the results...`;
    }
  };

  const renderProgressDetails = () => {
    if (!isLoading || !progressData) return null;
    const currentStage = stageConfig[progressData.Stage];

    if (!currentStage) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center">
          <div className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentStage.name}
          </div>
          {currentStage.showRatio && (
            <div className="ml-3 text-sm font-medium bg-gradient-to-r from-slate-50 to-gray-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
              {progressData.Completed}/{progressData.Streamers}
            </div>
          )}
          {currentStage.showFoundStreamerNumber && (
            <div className="ml-3 text-sm font-medium bg-gradient-to-r from-slate-50 to-gray-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
              {progressData.Streamers} Streamers Found
            </div>
          )}
        </div>

        {currentStage.showPercentage && (
          <div className="relative pt-2">
            <div className="overflow-hidden h-4 mb-3 text-xs flex rounded-full bg-gradient-to-r from-slate-50 to-gray-50 border border-blue-100">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progressData.Percentage}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="shadow-sm flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center">
                <motion.span
                  className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
                {currentStage.description}
              </div>
              <div className="font-bold text-blue-700">
                {progressData.Percentage}%
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {currentStage.showRate && progressData.Rate && (
            <motion.div
              className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-blue-100 flex items-center shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4 shadow-sm">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
              <div>

                <div className="text-xs text-blue-600 font-medium">Processing Rate</div>
                <div className="text-sm font-bold text-gray-800">
                  {Number(progressData.Rate).toFixed(0)
                    ? Number(progressData.Rate).toFixed(0)
                    : "N/A"}{" "}
                  sec/streamer
                </div>
              </div>
            </motion.div>
          )}

          {currentStage.showETA && (
            <motion.div
              className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-blue-100 flex items-center shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4 shadow-sm">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-blue-600 font-medium">Estimated Time</div>
                <div className="text-sm font-bold text-gray-800">
                  {progressData.ETA
                    ? progressData.ETA
                    : "N/A"}
                   remaining
                </div>
              </div>
            </motion.div>
          )}

          {currentStage.showStreamers && (
            <motion.div
              className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-blue-100 flex items-center shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4 shadow-sm">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-blue-600 font-medium">
                  Total Live Streamers
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {progressData.Total_Streamers}
                </div>
              </div>
            </motion.div>
          )}

          {currentStage.showCompleted && (
            <motion.div
              className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-blue-100 flex items-center shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-blue-600 font-medium">
                  Completed
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {progressData.Completed}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full max-w-none">
      <div
        className={`grid gap-6 ${
          isLoading
            ? "grid-cols-1"
            : isFilterCollapsed
            ? "grid-cols-[80px_1fr]"
            : "grid-cols-[400px_1fr]"
        } transition-all duration-300`}
      >
        {!isLoading && (
          <div className="h-fit">
            <AnimatePresence mode="wait">
              <motion.div
                key="filter"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
                className="sticky top-6"
              >
                <FilterSection
                  language={language}
                  setLanguage={setLanguage}
                  category={category}
                  setCategory={setCategory}
                  minFollowers={minFollowers}
                  setMinFollowers={setMinFollowers}
                  maxFollowers={maxFollowers}
                  setMaxFollowers={setMaxFollowers}
                  minViewers={minViewers}
                  setMinViewers={setMinViewers}
                  maxViewers={maxViewers}
                  setMaxViewers={setMaxViewers}
                  onApplyFilters={handleSearch}
                  onResetFilters={resetFilters}
                  isCollapsed={isFilterCollapsed}
                  toggleCollapse={toggleFilterCollapse}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="min-w-0 flex-1">
          {!isLoading && (
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200"
                onClick={toggleFilterCollapse}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {isFilterCollapsed ? "Show Filters" : "Hide Filters"}
                {activeFiltersCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideUp}
                className="w-full"
              >
                <Card className="border-2 border-blue-100 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center justify-center py-6 mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="relative"
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Search className="h-8 w-8 text-white" />
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-blue-200"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        />
                      </motion.div>
                      <h3 className="text-xl font-bold mt-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {getStatusMessage()}
                      </h3>
                    </div>
                    <div className="w-full mx-auto">
                      {renderProgressDetails()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : loadingStreamers ? (
              <motion.div
                key="loading-streamers"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideUp}
              >
                <Card className="border-2 border-blue-100 shadow-lg overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center justify-center py-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <RefreshCw className="h-12 w-12 text-blue-500" />
                      </motion.div>
                      <h3 className="text-lg font-semibold mt-4 text-gray-800">
                        Loading data table...
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : streamers.length > 0 ? (
              <motion.div
                key="results"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideUp}
              >
                <div className="w-full overflow-hidden rounded-xl border-2 border-blue-100 shadow-lg bg-white">
                  <TwitchDataTable data={streamers} subscribed={subscribed} />
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    {streamers.length} results{" "}
                    {!subscribed && streamers.length === 3 && "(limited)"}
                  </div>
                  {streamers.length > 5 && (
                    <div className="text-sm text-gray-500">
                      Showing results per page
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideUp}
              >
                <Card className="border-2 border-blue-100 shadow-lg overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="text-center space-y-6 w-full max-w-md">
                      <motion.div
                        className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-full inline-block mx-auto border-2 border-blue-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Search className="h-12 w-12 text-blue-500" />
                      </motion.div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Ready to Find Streamers
                      </h3>
                      <p className="text-gray-600 max-w-md leading-relaxed">
                        Use the search filters to find Twitch streamers that
                        match your criteria. Set your preferences and start
                        discovering!
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform"
                          onClick={handleSearch}
                        >
                          <Search className="mr-2 h-5 w-5" />
                          Start Searching
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
