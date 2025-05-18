"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import SearchTab from "./tabs/search-tab";
import SavedSearchesTab from "./tabs/saved-searches-tab";
import SearchHistoryTab from "./tabs/search-history-tab";

// Import types and mock data
import type { ScrapingProgress, TwitchData } from "./types";
import { set } from "date-fns";
import User from "@/app/types/user";
import { useUser } from "@/app/context/UserContext";
import Papa from "papaparse";

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
  const [progressData, setProgressData] = useState<ScrapingProgress | null>();
  const progressDataRef = useRef<ScrapingProgress | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { user: contextUser, loading } = useUser();
  const [streamers, setStreamers] = useState<TwitchData[]>([]);
  const [loadingStreamers, setLoadingStreamers] = useState(false);
  // Load user after component is mounted
  useEffect(() => {
    if (!loading) {
      setUser(contextUser);
    }
  }, [contextUser, loading]);

  // Update the ref whenever progressData changes
  const updateProgressData = (data: ScrapingProgress) => {
    setProgressData(data);
    progressDataRef.current = data; // Keep the ref in sync with the state
  };

  // useEffect(() => {
  //   if (
  //     !progressData?.download_url ||
  //     !progressData?.download_url.startsWith("http") ||
  //     !streamers.length
  //   ) {
  //     return;
  //   }
  //   setLoadingStreamers(true);
  //   fetch(progressData.download_url)
  //     .then((res) => res.text())
  //     .then((csvText) => {
  //       Papa.parse<TwitchData>(csvText, {
  //         header: true,
  //         skipEmptyLines: true,
  //         complete: (result) => {
  //           console.log(result);
  //           setStreamers(result.data);
  //         },
  //         error: (err: any) => {
  //           console.error("CSV parsing error:", err);
  //         },
  //       });
  //     });
  //   setLoadingStreamers(false);
  //   return;
  // }, [progressData?.download_url]);

  // Function to handle search with detailed progress updates
  const handleSearch = async () => {
    setIsLoading(true);
    setLoadingProgress(0);

    if (progressData !== null) {
      setProgressData(null);
    }
    setStreamers([]);

    try {
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
      const triggerRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}Twitch_scraper?category=516575&minimum_followers=10&viewer_count=10&user_id=${user?.id}&language=en&maximum_followers=100005`,
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

      const pollInterval = 500;

      const pollingInterval = setInterval(async () => {
        try {
          const progressRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}Twitch_scraper/get_progress?user_id=${user?.id}`,
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

          const data = await progressRes.json();

          console.log(data);

          setProgressData(data);

          if (data?.Done) {
            clearInterval(pollingInterval);
            setLoadingStreamers(true);
            setIsLoading(false);
            fetch(data.download_url)
              .then((res) => res.text())
              .then((csvText) => {
                Papa.parse<TwitchData>(csvText, {
                  header: true,
                  skipEmptyLines: true,
                  complete: (result) => {
                    console.log(result);
                    setStreamers(result.data);
                    setLoadingStreamers(false);
                  },
                  error: (err: any) => {
                    console.error("CSV parsing error:", err);
                    setLoadingStreamers(true);
                  },
                });
              });
          }
        } catch (error) {
          console.error("Error polling scrape progress:", error);
          clearInterval(pollingInterval);
          setIsLoading(false);
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
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Twitch Scraper</h1>
        <p className="text-muted-foreground">
          Find and filter Twitch streamers based on your specific requirements.
        </p>
      </div>

      {/* {!subscribed && (
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
      )} */}

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
            progressData={progressData}
            streamers={streamers}
            loadingStreamers={loadingStreamers}
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
