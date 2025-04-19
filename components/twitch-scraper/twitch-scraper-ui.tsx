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
  const [percentage, setPercentage] = useState(0);

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
  const handleSearch = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    setStatusMessage("Initializing search...");

    if (data.length > 0) {
      setData([]);
    }

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
        description: "Collecting Streamers",
        itemsProcessed: 0,
        totalItems: 0,
      },
      {
        name: "Stage 2",
        description: "Filtering streamers",
        itemsProcessed: 0,
        totalItems: 0,
      },
      {
        name: "Stage 3",
        description: "Getting streamers socials",
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

    try {
      // ✅ Step 1: Trigger the scrape
      const queryParams = new URLSearchParams({
        category: category || "32399",
        minimum_followers: minFollowers.toString(),
        maximum_followers: maxFollowers.toString(),
        language: language || "en",
        viewer_count: minViewers.toString(),
      });

      const triggerRes = await fetch(
        `http://127.0.0.1:8000/Twitch_scraper?category=32399&minimum_followers=${minFollowers}&language=en&viewer_count=${minViewers}&maximum_followers=${maxFollowers}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!triggerRes.ok) {
        throw new Error("Failed to start the scraping process");
      }

      const pollInterval = 100;

      const pollingInterval = setInterval(async () => {
        try {
          const progressRes = await fetch(
            "http://127.0.0.1:8000/Twitch_scraper/get_progress",
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            }
          );

          if (!progressRes.ok) {
            throw new Error("Failed to fetch scrape progress");
          }

          const progressData = await progressRes.json();
          console.log("Scrape Progress:", progressData);

          const { Stage, Rate, ETA, Streamers, Completed } = progressData;

          const computedPercentage = Math.min(Math.round(Rate * 100), 100);

          setCurrentStageIndex(Stage);
          setLoadingProgress(computedPercentage);
          setPercentage(computedPercentage);
          setStatusMessage(
            `Stage ${Stage}: ${Completed}/${Streamers} streamers processed`
          );

          // if (Rate >= 1.0) {
          //   clearInterval(pollingInterval);
          //   setIsLoading(false);
          //   setStatusMessage("Scrape complete!");
          // }
        } catch (error) {
          console.error("Error polling scrape progress:", error);
          clearInterval(pollingInterval);
          setIsLoading(false);
          setStatusMessage("An error occurred while fetching scrape progress.");
        }
      }, pollInterval);

      // Start first poll immediately
      setTimeout(() => {
        // Small delay to give backend a head start
        pollingInterval;
      }, 500);
    } catch (error) {
      console.error("Error starting scrape:", error);
      setIsLoading(false);
      setStatusMessage("An error occurred while starting the scrape.");
    }
  };

  // // Helper function to simulate progress updates for a stage
  // const simulateStageProgress = (
  //   stageIndex: number,
  //   totalItems: number,
  //   targetProgress: number,
  //   updateSpeed: number,
  //   onComplete: () => void
  // ) => {
  //   let processed = 0;

  //   const interval = setInterval(() => {
  //     processed++;

  //     // Update the stage's processed items
  //     const updatedStages = [...scrapingStages];
  //     updatedStages[stageIndex].itemsProcessed = processed;
  //     setScrapingStages(updatedStages);

  //     // Calculate overall progress based on current stage and items processed
  //     const stageProgressContribution =
  //       (targetProgress - loadingProgress) * (processed / totalItems);
  //     setLoadingProgress(
  //       Math.min(loadingProgress + stageProgressContribution, targetProgress)
  //     );

  //     // If all items in this stage are processed, move to the next stage
  //     if (processed >= totalItems) {
  //       clearInterval(interval);
  //       onComplete();
  //     }
  //   }, updateSpeed);
  // };

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
