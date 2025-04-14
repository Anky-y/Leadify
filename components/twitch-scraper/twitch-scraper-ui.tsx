"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  RefreshCw,
  Save,
  Trash2,
  History,
  PlusCircle,
} from "lucide-react";
import TwitchDataTable from "./twitch-data-table";
import FilterSection from "./filter-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Mock data for demonstration
import { mockTwitchData } from "./mock-data";

// Types
import type { TwitchData, SavedSearch } from "./types";
import { useUser } from "@/app/context/UserContext1";
import User from "../../app/types/user";

export default function TwitchScraperUI() {
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
  const [data, setData] = useState<TwitchData[]>([]);
  const [exportFormat, setExportFormat] = useState("csv");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [activeTab, setActiveTab] = useState("search");

  const { user } = useUser();

  // State for saved searches
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // State for search history
  const [searchHistory, setSearchHistory] = useState<
    {
      id: string;
      date: Date;
      query: string;
      results: number;
    }[]
  >([]);

  const { toast } = useToast();

  // Load saved searches from localStorage on component mount
  useEffect(() => {
    const savedSearchesFromStorage = localStorage.getItem("savedSearches");
    if (savedSearchesFromStorage) {
      setSavedSearches(JSON.parse(savedSearchesFromStorage));
    }

    const searchHistoryFromStorage = localStorage.getItem("searchHistory");
    if (searchHistoryFromStorage) {
      setSearchHistory(JSON.parse(searchHistoryFromStorage));
    }
  }, []);

  // Save searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
  }, [savedSearches]);

  // Save search history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const [showAddToCrmDialog, setShowAddToCrmDialog] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Filter data based on search criteria
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
      const limitedData = user?.is_subscribed
        ? filteredData
        : filteredData.slice(0, 10);
      setData(limitedData);

      // Add to search history
      const newSearchHistoryItem = {
        id: Date.now().toString(),
        date: new Date(),
        query: searchTerm || "All streamers",
        results: filteredData.length,
      };

      setSearchHistory((prev) => [newSearchHistoryItem, ...prev].slice(0, 20)); // Keep only last 20 searches

      // Show toast with result count
      toast({
        title: "Search Results",
        description: `Found ${filteredData.length} results${
          !user?.is_subscribed && filteredData.length > 10
            ? `, showing 10 (upgrade to see all)`
            : ""
        }`,
      });
    }, 1000);
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "Please perform a search first to get data for export.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would generate a file in the selected format
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

    // Check if user has reached the limit of saved searches (for free users)
    if (!user?.is_subscribed && savedSearches.length >= 5) {
      toast({
        title: "Limit Reached",
        description:
          "Free users can save up to 5 searches. Upgrade to Premium for unlimited saved searches.",
        variant: "destructive",
      });
      return;
    }

    // Create new saved search
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: {
        searchTerm,
        language,
        category,
        minFollowers,
        maxFollowers,
        minViewers,
        maxViewers,
      },
    };

    // Add to saved searches
    setSavedSearches([...savedSearches, newSavedSearch]);

    // Close dialog and reset name
    setSaveDialogOpen(false);
    setSearchName("");

    toast({
      title: "Search saved",
      description: `Your search "${searchName}" has been saved.`,
    });
  };

  const handleLoadSearch = (search: SavedSearch) => {
    // Load search filters
    setSearchTerm(search.filters.searchTerm);
    setLanguage(search.filters.language);
    setCategory(search.filters.category);
    setMinFollowers(search.filters.minFollowers);
    setMaxFollowers(search.filters.maxFollowers);
    setMinViewers(search.filters.minViewers);
    setMaxViewers(search.filters.maxViewers);

    // Switch to search tab
    setActiveTab("search");

    // Execute search
    handleSearch();

    toast({
      title: "Search loaded",
      description: `Loaded saved search "${search.name}".`,
    });
  };

  const handleDeleteSearch = (id: string) => {
    setSavedSearches(savedSearches.filter((search) => search.id !== id));

    toast({
      title: "Search deleted",
      description: "Your saved search has been deleted.",
    });
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

    // In a real app, this would add the data to the CRM
    // For now, we'll just simulate it with localStorage
    const existingLeads = JSON.parse(localStorage.getItem("crmLeads") || "[]");

    // Convert Twitch data to CRM lead format
    const newLeads = data.map((item) => ({
      id: `twitch-${item.id}`,
      name: item.username,
      platform: "Twitch",
      followers: item.followers,
      engagement: item.viewers,
      language: item.language,
      category: item.category,
      email: item.email,
      social: {
        discord: item.discord,
        youtube: item.youtube,
        twitter: item.twitter,
        facebook: item.facebook,
        instagram: item.instagram,
      },
      url: item.channelUrl,
      sequenceStatus: "Not Started",
      stage: "New Lead",
      replied: false,
      classification: "Unclassified",
      dateAdded: new Date().toISOString(),
    }));

    // Add new leads to existing leads
    const updatedLeads = [...existingLeads, ...newLeads];
    localStorage.setItem("crmLeads", JSON.stringify(updatedLeads));

    setShowAddToCrmDialog(false);

    toast({
      title: "Added to CRM",
      description: `${data.length} leads have been added to your CRM.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Twitch Scraper</h1>
        <p className="text-muted-foreground">
          Find and filter Twitch streamers based on your specific requirements.
        </p>
      </div>

      {!user?.is_subscribed && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Free account limitations</AlertTitle>
          <AlertDescription>
            You're using a free account which limits results to 10 entries and
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="saved">
            Saved Searches{" "}
            {savedSearches.length > 0 && `(${savedSearches.length})`}
          </TabsTrigger>
          <TabsTrigger value="history">
            Search History{" "}
            {searchHistory.length > 0 && `(${searchHistory.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
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
              onResetFilters={() => {
                setLanguage("");
                setCategory("");
                setMinFollowers(1000);
                setMaxFollowers(10000000);
                setMinViewers(10);
                setMaxViewers(100000);
              }}
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
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog
                    open={saveDialogOpen}
                    onOpenChange={setSaveDialogOpen}
                  >
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
                    <Select
                      value={exportFormat}
                      onValueChange={setExportFormat}
                    >
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
                  {!user?.is_subscribed &&
                    data.length === 10 &&
                    mockTwitchData.length > 10 &&
                    "(limited)"}
                </div>
                {/* 
                {!user?.is_subscribed && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="subscription-toggle"
                      checked={user?.is_subscribed}
                      onCheckedChange={user?.is_subscribed}
                    />
                    <Label htmlFor="subscription-toggle" className="text-sm">
                      Simulate Premium Account
                    </Label>
                  </div>
                )} */}
              </div>

              {data.length > 0 ? (
                <>
                  <TwitchDataTable
                    data={data}
                    subscribed={user?.is_subscribed}
                  />
                  <div className="flex justify-end mt-4">
                    <Dialog
                      open={showAddToCrmDialog}
                      onOpenChange={setShowAddToCrmDialog}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-blue-700 hover:bg-blue-800">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add to CRM
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add to CRM</DialogTitle>
                          <DialogDescription>
                            Add these {data.length} Twitch streamers to your CRM
                            as leads.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-500">
                            This will add all {data.length} streamers from your
                            current search results to your CRM. You can manage
                            these leads, add them to email sequences, and track
                            your outreach from the CRM dashboard.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddToCrmDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleAddToCrm}>Add to CRM</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center space-y-2">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No search results</h3>
                      <p className="text-gray-500 max-w-md">
                        Use the search bar and filters to find Twitch streamers
                        that match your criteria.
                      </p>
                      <Button
                        className="mt-4 bg-blue-700 hover:bg-blue-800"
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
        </TabsContent>

        <TabsContent value="saved">
          {savedSearches.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <Save className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No saved searches</h3>
                  <p className="text-gray-500 max-w-md">
                    Save your searches to quickly access them later. Click the
                    "Save Search" button after setting up your filters.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedSearches.map((search) => (
                <Card key={search.id} className="border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{search.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1 text-sm text-gray-500">
                      {search.filters.searchTerm && (
                        <p>
                          Search:{" "}
                          <span className="font-medium">
                            {search.filters.searchTerm}
                          </span>
                        </p>
                      )}
                      {search.filters.language && (
                        <p>
                          Language:{" "}
                          <span className="font-medium">
                            {search.filters.language}
                          </span>
                        </p>
                      )}
                      {search.filters.category && (
                        <p>
                          Category:{" "}
                          <span className="font-medium">
                            {search.filters.category}
                          </span>
                        </p>
                      )}
                      <p>
                        Followers:{" "}
                        <span className="font-medium">
                          {search.filters.minFollowers.toLocaleString()} -{" "}
                          {search.filters.maxFollowers.toLocaleString()}
                        </span>
                      </p>
                      <p>
                        Viewers:{" "}
                        <span className="font-medium">
                          {search.filters.minViewers.toLocaleString()} -{" "}
                          {search.filters.maxViewers.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                  <div className="px-6 py-2 flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteSearch(search.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-700 hover:bg-blue-800"
                      onClick={() => handleLoadSearch(search)}
                    >
                      Load
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {searchHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No search history</h3>
                  <p className="text-gray-500 max-w-md">
                    Your search history will appear here after you perform
                    searches.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Search History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{item.query}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleString()} •{" "}
                          {item.results} results
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => {
                          setSearchTerm(item.query);
                          setActiveTab("search");
                          handleSearch();
                        }}
                      >
                        Run Again
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
