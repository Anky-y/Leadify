"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Save,
  PlusCircle,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Papa from "papaparse";

// Import components
import FilterSection from "../filter-section";
import TwitchDataTable from "../twitch-data-table";

// Import types
import type { ScrapingProgress, Streamer, TwitchData } from "../types";

// Define the scraping stage type
type ScrapingStage = {
  name: string;
  description: string;
  itemsProcessed: number;
  totalItems: number;
};

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
  loadingProgress,
  data,
  subscribed,
  setSubscribed,
  initialSubscribed,
  handleSearch,
  progressData,
  streamers,
  loadingStreamers,
}: SearchTabProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [showAddToCrmDialog, setShowAddToCrmDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");

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

  const { toast } = useToast();

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "Please perform a search first to get data for export.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Exporting data as ${exportFormat.toUpperCase()}`,
      description: `${data.length} records will be exported.`,
    });
  };

  const handleSaveSearch = () => {
    if (!searchName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your saved search.",
        variant: "destructive",
      });
      return;
    }

    // Save search logic would go here
    toast({
      title: "Search saved",
      description: `Your search "${searchName}" has been saved.`,
    });
    setSaveDialogOpen(false);
    setSearchName("");
  };

  const handleAddToCrm = () => {
    if (data.length === 0) {
      toast({
        title: "No data to add",
        description: "Please perform a search first to get data for the CRM.",
        variant: "destructive",
      });
      return;
    }

    setShowAddToCrmDialog(false);

    toast({
      title: "Added to CRM",
      description: `${data.length} leads have been added to your CRM.`,
    });
  };

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

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Search
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Search</DialogTitle>
                    <DialogDescription>
                      Give your search a name to save it for future use.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="search-name">Search Name</Label>
                    <Input
                      id="search-name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="e.g., English Fortnite Streamers"
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setSaveDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSearch}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex items-center gap-2">
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={handleExport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              {data.length} results{" "}
              {!subscribed && data.length === 3 && "(limited)"}
            </div>

            {!initialSubscribed && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="subscription-toggle"
                  checked={subscribed}
                  onCheckedChange={setSubscribed}
                />
                <Label htmlFor="subscription-toggle" className="text-sm">
                  Simulate Premium Account
                </Label>
              </div>
            )}
          </div>
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
              <TwitchDataTable data={streamers} subscribed={subscribed} />
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
