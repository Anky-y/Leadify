"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchTab from "./tabs/search-tab";
import SavedStreamersTab from "./tabs/saved-streamers-tab";
import SavedFiltersTab from "./tabs/saved-filters-tab";
// Remove or comment out the old import:
// import SearchHistoryTab from "./tabs/search-history-tab";

// Import types and mock data
import type { ScrapingProgress, TwitchData } from "./types";
import type User from "@/app/types/user";
import { useUser } from "@/app/context/UserContext";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}Twitch_scraper?category=27471&minimum_followers=10&viewer_count=10&user_id=${user?.id}&language=en&maximum_followers=100005`,
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

  // Animation variants
  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const itemTransition = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      <motion.div variants={itemTransition}>
        <h1 className="text-3xl font-bold tracking-tight">Twitch Scraper</h1>
        <p className="text-muted-foreground">
          Find and filter Twitch streamers based on your specific requirements.
        </p>
      </motion.div>

      <motion.div variants={itemTransition}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger
              value="search"
              className="transition-all duration-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              Search
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="transition-all duration-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              Saved Streamers
            </TabsTrigger>
            <TabsTrigger
              value="filters"
              className="transition-all duration-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              Saved Filters
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === "search" && (
              <motion.div
                key="search-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="search" forceMount>
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
              </motion.div>
            )}

            {activeTab === "saved" && (
              <motion.div
                key="saved-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="saved" forceMount>
                  <SavedStreamersTab />
                </TabsContent>
              </motion.div>
            )}

            {activeTab === "filters" && (
              <motion.div
                key="filters-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="filters" forceMount>
                  <SavedFiltersTab
                    setActiveTab={setActiveTab}
                    handleSearch={handleSearch}
                    setLanguage={setLanguage}
                    setCategory={setCategory}
                    setMinFollowers={setMinFollowers}
                    setMaxFollowers={setMaxFollowers}
                    setMinViewers={setMinViewers}
                    setMaxViewers={setMaxViewers}
                    language={language}
                    category={category}
                    minFollowers={minFollowers}
                    maxFollowers={maxFollowers}
                    minViewers={minViewers}
                    maxViewers={maxViewers}
                  />
                </TabsContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
