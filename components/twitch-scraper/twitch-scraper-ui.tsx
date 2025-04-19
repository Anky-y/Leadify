"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import SearchTab from "./tabs/search-tab";
import SavedSearchesTab from "./tabs/saved-searches-tab";
import SearchHistoryTab from "./tabs/search-history-tab";

// Import types and mock data
import { mockTwitchData } from "./mock-data";
import type { TwitchData } from "./types";

// Define the scraping stages
type ScrapingStage = {
  name: string;
  description: string;
  itemsProcessed: number;
  totalItems: number;
};

interface TwitchScraperUIProps {
  initialSubscribed?: boolean;
}

export default function TwitchScraperUI({
  initialSubscribed = false,
}: TwitchScraperUIProps) {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [minFollowers, setMinFollowers] = useState<number>(1000);
  const [maxFollowers, setMaxFollowers] = useState<number>(10000000);
  const [minViewers, setMinViewers] = useState<number>(10);
  const [maxViewers, setMaxViewers] = useState<number>(100000);

  // State for UI
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [data, setData] = useState<TwitchData[]>([]);
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [activeTab, setActiveTab] = useState("search");

  // New state for detailed progress tracking
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [scrapingStages, setScrapingStages] = useState<ScrapingStage[]>([
    {
      name: "Initializing",
      description: "Setting up scraper",
      itemsProcessed: 0,
      totalItems: 1,
    },
    {
      name: "Stage 1",
      description: "Collecting channel data",
      itemsProcessed: 0,
      totalItems: 0,
    },
    {
      name: "Stage 2",
      description: "Fetching social media links",
      itemsProcessed: 0,
      totalItems: 0,
    },
    {
      name: "Stage 3",
      description: "Processing contact information",
      itemsProcessed: 0,
      totalItems: 0,
    },
    {
      name: "Finalizing",
      description: "Preparing results",
      itemsProcessed: 0,
      totalItems: 1,
    },
  ]);
  const [statusMessage, setStatusMessage] = useState("");

  // Function to handle search with detailed progress updates
  const handleSearch = () => {
    setIsLoading(true);
    setLoadingProgress(0);

    // Reset progress tracking
    setCurrentStageIndex(0);
    const initialStages = [
      {
        name: "Initializing",
        description: "Setting up scraper",
        itemsProcessed: 0,
        totalItems: 1,
      },
      {
        name: "Stage 1",
        description: "Collecting channel data",
        itemsProcessed: 0,
        totalItems: 0,
      },
      {
        name: "Stage 2",
        description: "Fetching social media links",
        itemsProcessed: 0,
        totalItems: 0,
      },
      {
        name: "Stage 3",
        description: "Processing contact information",
        itemsProcessed: 0,
        totalItems: 0,
      },
      {
        name: "Finalizing",
        description: "Preparing results",
        itemsProcessed: 0,
        totalItems: 1,
      },
    ];
    setScrapingStages(initialStages);
    setStatusMessage("Initializing search...");

    // Clear previous results when starting a new search
    if (data.length > 0) {
      setData([]);
    }

    // Simulate the initialization stage
    setTimeout(() => {
      // Update initialization stage
      const updatedStages = [...initialStages];
      updatedStages[0].itemsProcessed = 1;
      setScrapingStages(updatedStages);
      setLoadingProgress(5);

      // Move to Stage 1: Collecting channel data
      setCurrentStageIndex(1);
      setStatusMessage("Collecting channel data...");

      // Filter data based on search criteria to determine how many items we'll process
      const filteredData = mockTwitchData.filter((item) => {
        // Filter by search term
        if (
          searchTerm &&
          !item.username.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        // Filter by language
        if (
          language &&
          language !== "any" &&
          item.language.toLowerCase() !== language.toLowerCase()
        ) {
          return false;
        }

        // Filter by category
        if (
          category &&
          category !== "any" &&
          item.category.toLowerCase() !== category.toLowerCase()
        ) {
          return false;
        }

        // Filter by follower count
        if (item.followers < minFollowers || item.followers > maxFollowers) {
          return false;
        }

        // Filter by viewer count
        if (item.viewers < minViewers || item.viewers > maxViewers) {
          return false;
        }

        return true;
      });

      // Apply result limit if not subscribed
      const limitedData = subscribed ? filteredData : filteredData.slice(0, 3);
      const totalItems = limitedData.length;

      // Update stage 1 total items
      updatedStages[1].totalItems = totalItems;
      setScrapingStages(updatedStages);

      // Simulate Stage 1 progress updates
      simulateStageProgress(1, totalItems, 50, 100, () => {
        // Move to Stage 2: Fetching social media links
        setCurrentStageIndex(2);
        setStatusMessage("Fetching social media links...");

        // Update stage 2 total items
        const stage2UpdatedStages = [...updatedStages];
        stage2UpdatedStages[2].totalItems = totalItems;
        setScrapingStages(stage2UpdatedStages);

        // Simulate Stage 2 progress updates
        simulateStageProgress(2, totalItems, 70, 50, () => {
          // Move to Stage 3: Processing contact information
          setCurrentStageIndex(3);
          setStatusMessage("Processing contact information...");

          // Update stage 3 total items
          const stage3UpdatedStages = [...stage2UpdatedStages];
          stage3UpdatedStages[3].totalItems = totalItems;
          setScrapingStages(stage3UpdatedStages);

          // Simulate Stage 3 progress updates
          simulateStageProgress(3, totalItems, 90, 75, () => {
            // Move to Finalizing stage
            setCurrentStageIndex(4);
            setStatusMessage("Finalizing results...");

            // Update finalizing stage
            const finalizingStages = [...stage3UpdatedStages];
            finalizingStages[4].itemsProcessed = 1;
            setScrapingStages(finalizingStages);
            setLoadingProgress(100);

            // Complete the search
            setTimeout(() => {
              setData(limitedData);
              setIsLoading(false);
              setStatusMessage("");
            }, 500);
          });
        });
      });
    }, 500);
  };

  // Helper function to simulate progress updates for a stage
  const simulateStageProgress = (
    stageIndex: number,
    totalItems: number,
    targetProgress: number,
    updateSpeed: number,
    onComplete: () => void
  ) => {
    let processed = 0;

    const interval = setInterval(() => {
      processed++;

      // Update the stage's processed items
      const updatedStages = [...scrapingStages];
      updatedStages[stageIndex].itemsProcessed = processed;
      setScrapingStages(updatedStages);

      // Calculate overall progress based on current stage and items processed
      const stageProgressContribution =
        (targetProgress - loadingProgress) * (processed / totalItems);
      setLoadingProgress(
        Math.min(loadingProgress + stageProgressContribution, targetProgress)
      );

      // If all items in this stage are processed, move to the next stage
      if (processed >= totalItems) {
        clearInterval(interval);
        onComplete();
      }
    }, updateSpeed);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Twitch Scraper</h1>
        <p className="text-muted-foreground">
          Find and filter Twitch streamers based on your specific requirements.
        </p>
      </div>

      {!subscribed && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Free account limitations</AlertTitle>
          <AlertDescription>
            You're using a free account which limits results to 3 entries and
            masks contact information.{" "}
            <a
              href="/dashboard/billing"
              className="font-medium underline underline-offset-4"
            >
              Upgrade your plan
            </a>{" "}
            to unlock unlimited results and full contact details.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="saved">Saved Searches</TabsTrigger>
          <TabsTrigger value="history">Search History</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <SearchTab
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
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
            isLoading={isLoading}
            loadingProgress={loadingProgress}
            data={data}
            subscribed={subscribed}
            setSubscribed={setSubscribed}
            initialSubscribed={initialSubscribed}
            handleSearch={handleSearch}
            // Pass the new progress tracking props
            currentStage={scrapingStages[currentStageIndex]}
            statusMessage={statusMessage}
          />
        </TabsContent>

        <TabsContent value="saved">
          <SavedSearchesTab
            setSearchTerm={setSearchTerm}
            setLanguage={setLanguage}
            setCategory={setCategory}
            setMinFollowers={setMinFollowers}
            setMaxFollowers={setMaxFollowers}
            setMinViewers={setMinViewers}
            setMaxViewers={setMaxViewers}
            setActiveTab={setActiveTab}
            handleSearch={handleSearch}
          />
        </TabsContent>

        <TabsContent value="history">
          <SearchHistoryTab
            setSearchTerm={setSearchTerm}
            setActiveTab={setActiveTab}
            handleSearch={handleSearch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
