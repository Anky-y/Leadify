"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Import components
import FilterSection from "../filter-section";
import TwitchDataTable from "../twitch-data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  FileJson,
} from "lucide-react";

// Import types
import type { ScrapingProgress, TwitchData } from "../types";

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

  // Add animation effect for progress changes
  useEffect(() => {
    if (progressData && progressData.Percentage > 0) {
      const progressElement = document.querySelector(".progress-animation");
      if (progressElement) {
        progressElement.classList.add("animate-pulse");
        setTimeout(() => {
          progressElement?.classList.remove("animate-pulse");
        }, 1000);
      }
    }
  }, [progressData?.Percentage]);

  console.log(streamers);

  const resetFilters = () => {
    setLanguage("");
    setCategory("");
    setMinFollowers(1000);
    setMaxFollowers(10000000);
    setMinViewers(10);
    setMaxViewers(100000);
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
    if (!isLoading || !progressData) return "Idle";

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

  // Helper function to render the progress details
  const renderProgressDetails = () => {
    if (!isLoading || !progressData) return null;
    const currentStage = stageConfig[progressData.Stage];

    if (!currentStage) return null;

    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center">
          <div className="text-base font-medium text-blue-700">
            {currentStage.name}
          </div>
          {currentStage.showRatio && (
            <div className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              {progressData.Completed}/{progressData.Streamers}
            </div>
          )}
          {currentStage.showFoundStreamerNumber && (
            <div className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              {progressData.Streamers} Streamers Found
            </div>
          )}
        </div>

        {currentStage.showPercentage && (
          <div className="relative pt-1">
            <div className="overflow-hidden h-3 mb-2 text-xs flex rounded-full bg-blue-100">
              <div
                style={{ width: `${progressData.Percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500 ease-in-out"
              ></div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600">
              <div className="flex items-center">
                <span className="inline-block mr-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {currentStage.description}
              </div>
              <div className="font-bold">{progressData.Percentage}%</div>
            </div>
          </div>
        )}

        {/* Additional Details for Current Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {currentStage.showRate && progressData.Rate && (
            <div className="bg-gray-50 p-3 rounded-lg flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Loader2 className="w-4 h-4 text-blue-700 animate-spin" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Processing Rate</div>
                <div className="text-sm font-medium">
                  {Number(progressData.Rate).toFixed(0)
                    ? Number(progressData.Rate).toFixed(0)
                    : "N/A"}{" "}
                  streamers/sec
                </div>
              </div>
            </div>
          )}

          {currentStage.showETA && (
            <div className="bg-gray-50 p-3 rounded-lg flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <AlertCircle className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Estimated Time</div>
                <div className="text-sm font-medium">
                  {Number(progressData.ETA).toFixed(0)
                    ? Number(progressData.ETA).toFixed(0)
                    : "N/A"}
                  seconds remaining
                </div>
              </div>
            </div>
          )}

          {currentStage.showStreamers && (
            <div className="bg-gray-50 p-3 rounded-lg flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Search className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500">
                  Total live streamers
                </div>
                <div className="text-sm font-medium">
                  {progressData.Total_Streamers}
                </div>
              </div>
            </div>
          )}

          {currentStage.showCompleted && (
            <div className="bg-gray-50 p-3 rounded-lg flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Completed</div>
                <div className="text-sm font-medium">
                  {progressData.Completed}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
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
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4"></div>
          <div className="space-y-6">
            {isLoading ? (
              <Card className="border border-blue-100 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-4 mb-4">
                    <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-medium mt-4 text-gray-800">
                      {getStatusMessage()}
                    </h3>
                  </div>
                  <div className="w-full mx-auto">
                    {renderProgressDetails()}
                  </div>
                </CardContent>
              </Card>
            ) : loadingStreamers ? (
              <Card className="border border-blue-100 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-4 mb-4">
                    <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-medium mt-4 text-gray-800">
                      Loading data table...
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ) : streamers.length > 0 ? (
              <div>
                <TwitchDataTable data={streamers} subscribed={subscribed} />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <div>
                    {streamers.length} results{" "}
                    {!subscribed && streamers.length === 3 && "(limited)"}
                  </div>
                  {streamers.length > 5 && (
                    <div className="text-sm text-gray-500">
                      Showing 15 results per page
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Card className="border border-blue-100 shadow-sm overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center space-y-4 w-full max-w-md">
                    <div className="bg-gray-50 p-6 rounded-full inline-block mx-auto">
                      <Search className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium">No search results</h3>
                    <p className="text-gray-500 max-w-md">
                      Use the search bar and filters to find Twitch streamers
                      that match your criteria.
                    </p>
                    <Button
                      className="mt-4 bg-blue-700 hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
                      onClick={handleSearch}
                    >
                      Search Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
