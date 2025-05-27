"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchTab from "./tabs/search-tab";
import SavedStreamersTab from "./tabs/saved-streamers-tab";
import SavedFiltersTab from "./tabs/saved-filters-tab";

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
  const [runSearchOnTab, setRunSearchOnTab] = useState(false);

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

    console.log(category);

    try {
      //const old_request = `${process.env.NEXT_PUBLIC_BACKEND_URL}Twitch_scraper?category=${category}&minimum_followers=10&viewer_count=10&user_id=${user?.id}&language=en&maximum_followers=100005`
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
      const triggerRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}Twitch_scraper`,
        {
          method: "POST",
          headers: {
        "Accept": "application/json",
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({category: "VALORANT", minimum_followers: 10, maximum_followers: 100000, viewer_count:20, language:"en", user_id: user?.id })
        }
      );
  

      if (!triggerRes.ok) {
        triggerRes.json().then((data) => console.log(data));
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
                    console.log(streamers);
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

  const handleSearchRef = useRef(handleSearch);

  useEffect(() => {
    handleSearchRef.current = handleSearch;
  }, []);

  useEffect(() => {
    if (activeTab === "search" && runSearchOnTab) {
      handleSearchRef.current();
      setRunSearchOnTab(false);
    }
  }, [activeTab, runSearchOnTab]);

  // Get dynamic header text based on active tab
  const getHeaderText = () => {
    switch (activeTab) {
      case "search":
        return {
          title: "Streamer Discovery",
          subtitle:
            "Find and analyze Twitch streamers based on your specific requirements",
        };
      case "saved":
        return {
          title: "Saved Streamers",
          subtitle:
            "Manage and organize your saved Twitch streamers collection",
        };
      case "filters":
        return {
          title: "Saved Filters",
          subtitle: "Quick access to your saved search filter configurations",
        };
      default:
        return {
          title: "Twitch Scraper",
          subtitle:
            "Find and analyze Twitch streamers based on your specific requirements",
        };
    }
  };

  const headerText = getHeaderText();

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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      <div className="w-full max-w-none px-6 py-6 space-y-6">
        <motion.div variants={itemTransition} className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
            {headerText.title}
          </h1>
          <p className="text-slate-600 text-lg">{headerText.subtitle}</p>
        </motion.div>

        <motion.div variants={itemTransition}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-6">
              <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200 p-0 rounded-xl shadow-lg">
                <TabsTrigger
                  value="search"
                  className="transition-all duration-300 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800 data-[state=active]:shadow-md px-8 py-3 rounded-lg font-semibold"
                >
                  Search
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="transition-all duration-300 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800 data-[state=active]:shadow-md px-8 py-3 rounded-lg font-semibold"
                >
                  Saved Streamers
                </TabsTrigger>
                <TabsTrigger
                  value="filters"
                  className="transition-all duration-300 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800 data-[state=active]:shadow-md px-8 py-3 rounded-lg font-semibold"
                >
                  Saved Filters
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "search" && (
                <motion.div
                  key="search-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="search" forceMount className="mt-0">
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="saved" forceMount className="mt-0">
                    <SavedStreamersTab />
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === "filters" && (
                <motion.div
                  key="filters-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="filters" forceMount className="mt-0">
                    <SavedFiltersTab
                      setActiveTab={setActiveTab}
                      handleSearch={handleSearch}
                      setLanguage={setLanguage}
                      setCategory={setCategory}
                      setMinFollowers={setMinFollowers}
                      setMaxFollowers={setMaxFollowers}
                      setMinViewers={setMinViewers}
                      setMaxViewers={setMaxViewers}
                      setRunSearchOnTab={setRunSearchOnTab}
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
      </div>
    </motion.div>
  );
}
