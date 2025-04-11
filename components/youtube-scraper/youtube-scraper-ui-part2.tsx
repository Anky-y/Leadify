"use client"

import type React from "react"

// Continuation of youtube-scraper-ui.tsx
import { useState } from "react"
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Download, History, RefreshCw, Save, Search, Trash2 } from "lucide-react"
import { YouTubeDataTable } from "./youtube-data-table"

// Mock data for demonstration purposes
const mockYouTubeData = [
  {
    id: "1",
    channelName: "TechCrunch",
    subscribers: 12000000,
    avgViews: 350000,
    uploadFrequency: "Weekly",
    contactInfo: "techcrunch@example.com",
  },
  {
    id: "2",
    channelName: "The Verge",
    subscribers: 8500000,
    avgViews: 500000,
    uploadFrequency: "Daily",
    contactInfo: "theverge@example.com",
  },
  {
    id: "3",
    channelName: "Marques Brownlee",
    subscribers: 15000000,
    avgViews: 2000000,
    uploadFrequency: "Weekly",
    contactInfo: "marques@example.com",
  },
  {
    id: "4",
    channelName: "Linus Tech Tips",
    subscribers: 14500000,
    avgViews: 1500000,
    uploadFrequency: "Daily",
    contactInfo: "linus@example.com",
  },
  {
    id: "5",
    channelName: "CNET",
    subscribers: 9000000,
    avgViews: 400000,
    uploadFrequency: "Weekly",
    contactInfo: "cnet@example.com",
  },
  {
    id: "6",
    channelName: "WIRED",
    subscribers: 7000000,
    avgViews: 600000,
    uploadFrequency: "Monthly",
    contactInfo: "wired@example.com",
  },
  {
    id: "7",
    channelName: "Engadget",
    subscribers: 6000000,
    avgViews: 300000,
    uploadFrequency: "Weekly",
    contactInfo: "engadget@example.com",
  },
  {
    id: "8",
    channelName: "9to5Google",
    subscribers: 3000000,
    avgViews: 250000,
    uploadFrequency: "Daily",
    contactInfo: "google@example.com",
  },
  {
    id: "9",
    channelName: "Android Authority",
    subscribers: 3500000,
    avgViews: 200000,
    uploadFrequency: "Daily",
    contactInfo: "android@example.com",
  },
  {
    id: "10",
    channelName: "Mrwhosetheboss",
    subscribers: 5000000,
    avgViews: 750000,
    uploadFrequency: "Weekly",
    contactInfo: "boss@example.com",
  },
  {
    id: "11",
    channelName: "Unbox Therapy",
    subscribers: 17000000,
    avgViews: 2500000,
    uploadFrequency: "Weekly",
    contactInfo: "unbox@example.com",
  },
]

interface SavedSearch {
  id: string
  name: string
  filters: {
    searchTerm: string
    language: string
    category: string
    minSubscribers: number
    maxSubscribers: number
    minViews: number
    maxViews: number
    uploadFrequency: string
  }
}

interface SearchHistoryItem {
  id: string
  query: string
  date: number
  results: number
}

interface FilterSectionProps {
  language: string
  setLanguage: (language: string) => void
  category: string
  setCategory: (category: string) => void
  minSubscribers: number
  setMinSubscribers: (minSubscribers: number) => void
  maxSubscribers: number
  setMaxSubscribers: (maxSubscribers: number) => void
  minViews: number
  setMinViews: (minViews: number) => void
  maxViews: number
  setMaxViews: (maxViews: number) => void
  uploadFrequency: string
  setUploadFrequency: (uploadFrequency: string) => void
  onApplyFilters: () => void
  onResetFilters: () => void
}

const FilterSection: React.FC<FilterSectionProps> = ({
  language,
  setLanguage,
  category,
  setCategory,
  minSubscribers,
  setMinSubscribers,
  maxSubscribers,
  setMaxSubscribers,
  minViews,
  setMinViews,
  maxViews,
  setMaxViews,
  uploadFrequency,
  setUploadFrequency,
  onApplyFilters,
  onResetFilters,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Customize your search criteria.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g., English"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Technology"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="min-subscribers">Min. Subscribers</Label>
          <Input
            type="number"
            id="min-subscribers"
            value={minSubscribers}
            onChange={(e) => setMinSubscribers(Number(e.target.value))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="max-subscribers">Max. Subscribers</Label>
          <Input
            type="number"
            id="max-subscribers"
            value={maxSubscribers}
            onChange={(e) => setMaxSubscribers(Number(e.target.value))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="min-views">Min. Avg. Views</Label>
          <Input type="number" id="min-views" value={minViews} onChange={(e) => setMinViews(Number(e.target.value))} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="max-views">Max. Avg. Views</Label>
          <Input type="number" id="max-views" value={maxViews} onChange={(e) => setMaxViews(Number(e.target.value))} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="upload-frequency">Upload Frequency</Label>
          <Select value={uploadFrequency} onValueChange={setUploadFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onResetFilters}>
          Reset
        </Button>
        <Button onClick={onApplyFilters}>Apply</Button>
      </CardFooter>
    </Card>
  )
}

export function YouTubeScraperUI() {
  const [activeTab, setActiveTab] = useState("search")
  const [searchTerm, setSearchTerm] = useState("")
  const [language, setLanguage] = useState("")
  const [category, setCategory] = useState("")
  const [minSubscribers, setMinSubscribers] = useState(1000)
  const [maxSubscribers, setMaxSubscribers] = useState(10000000)
  const [minViews, setMinViews] = useState(1000)
  const [maxViews, setMaxViews] = useState(100000000)
  const [uploadFrequency, setUploadFrequency] = useState("")
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [exportFormat, setExportFormat] = useState("csv")
  const [subscribed, setSubscribed] = useState(false)
  const [initialSubscribed, setInitialSubscribed] = useState(false)

  const handleSearch = () => {
    setIsLoading(true)

    // Simulate API call with a delay
    setTimeout(() => {
      const filteredData = mockYouTubeData.filter((item) => {
        const searchTermMatch = item.channelName.toLowerCase().includes(searchTerm.toLowerCase())
        const subscribersInRange = item.subscribers >= minSubscribers && item.subscribers <= maxSubscribers
        const viewsInRange = item.avgViews >= minViews && item.avgViews <= maxViews
        return searchTermMatch && subscribersInRange && viewsInRange
      })

      setData(subscribed ? filteredData : filteredData.slice(0, 10))
      setIsLoading(false)

      // Add to search history
      setSearchHistory([
        {
          id: Date.now().toString(),
          query: searchTerm,
          date: Date.now(),
          results: filteredData.length,
        },
        ...searchHistory,
      ])

      toast({
        title: "Search complete",
        description: `Found ${filteredData.length} matching creators${
          !subscribed && filteredData.length > 10 ? `, showing 10 (upgrade to see all)` : ""
        }`,
      })
    }, 1000)
  }

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "Please perform a search first to get data for export.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would generate a file in the selected format
    toast({
      title: `Exporting data as ${exportFormat.toUpperCase()}`,
      description: `${data.length} records will be exported.`,
    })
  }

  const handleSaveSearch = () => {
    if (!searchName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your saved search.",
        variant: "destructive",
      })
      return
    }

    // Check if user has reached the limit of saved searches (for free users)
    if (!subscribed && savedSearches.length >= 5) {
      toast({
        title: "Limit Reached",
        description: "Free users can save up to 5 searches. Upgrade to Premium for unlimited saved searches.",
        variant: "destructive",
      })
      return
    }

    // Create new saved search
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: {
        searchTerm,
        language,
        category,
        minSubscribers,
        maxSubscribers,
        minViews,
        maxViews,
        uploadFrequency,
      },
    }

    // Add to saved searches
    setSavedSearches([...savedSearches, newSavedSearch])

    // Close dialog and reset name
    setSaveDialogOpen(false)
    setSearchName("")

    toast({
      title: "Search saved",
      description: `Your search "${searchName}" has been saved.`,
    })
  }

  const handleLoadSearch = (search: SavedSearch) => {
    // Load search filters
    setSearchTerm(search.filters.searchTerm)
    setLanguage(search.filters.language)
    setCategory(search.filters.category)
    setMinSubscribers(search.filters.minSubscribers)
    setMaxSubscribers(search.filters.maxSubscribers)
    setMinViews(search.filters.minViews)
    setMaxViews(search.filters.maxViews)
    setUploadFrequency(search.filters.uploadFrequency)

    // Switch to search tab
    setActiveTab("search")

    // Execute search
    handleSearch()

    toast({
      title: "Search loaded",
      description: `Loaded saved search "${search.name}".`,
    })
  }

  const handleDeleteSearch = (id: string) => {
    setSavedSearches(savedSearches.filter((search) => search.id !== id))

    toast({
      title: "Search deleted",
      description: "Your saved search has been deleted.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">YouTube Scraper</h1>
        <p className="text-muted-foreground">Find and filter YouTube creators based on your specific requirements.</p>
      </div>

      {!subscribed && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Free account limitations</AlertTitle>
          <AlertDescription>
            You're using a free account which limits results to 10 entries and masks contact information.{" "}
            <a href="/dashboard/billing" className="font-medium underline underline-offset-4">
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
            Saved Searches {savedSearches.length > 0 && `(${savedSearches.length})`}
          </TabsTrigger>
          <TabsTrigger value="history">
            Search History {searchHistory.length > 0 && `(${searchHistory.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <FilterSection
              language={language}
              setLanguage={setLanguage}
              category={category}
              setCategory={setCategory}
              minSubscribers={minSubscribers}
              setMinSubscribers={setMinSubscribers}
              maxSubscribers={maxSubscribers}
              setMaxSubscribers={setMaxSubscribers}
              minViews={minViews}
              setMinViews={setMinViews}
              maxViews={maxViews}
              setMaxViews={setMaxViews}
              uploadFrequency={uploadFrequency}
              setUploadFrequency={setUploadFrequency}
              onApplyFilters={handleSearch}
              onResetFilters={() => {
                setLanguage("")
                setCategory("")
                setMinSubscribers(1000)
                setMaxSubscribers(10000000)
                setMinViews(1000)
                setMaxViews(100000000)
                setUploadFrequency("")
              }}
            />

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      placeholder="Search by channel name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch()
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full"
                      onClick={handleSearch}
                      disabled={isLoading}
                    >
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        <Save className="mr-2 h-4 w-4" />
                        Save Search
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Search</DialogTitle>
                        <DialogDescription>Give your search a name to save it for future use.</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="search-name">Search Name</Label>
                        <Input
                          id="search-name"
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                          placeholder="e.g., Tech Reviewers 100K+"
                          className="mt-2"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
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
                  {!subscribed && data.length === 10 && mockYouTubeData.length > 10 && "(limited)"}
                </div>

                {!initialSubscribed && (
                  <div className="flex items-center space-x-2">
                    <Switch id="subscription-toggle" checked={subscribed} onCheckedChange={setSubscribed} />
                    <Label htmlFor="subscription-toggle" className="text-sm">
                      Simulate Premium Account
                    </Label>
                  </div>
                )}
              </div>

              {data.length > 0 ? (
                <YouTubeDataTable data={data} subscribed={subscribed} />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center space-y-2">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No search results</h3>
                      <p className="text-gray-500 max-w-md">
                        Use the search bar and filters to find YouTube creators that match your criteria.
                      </p>
                      <Button className="mt-4 bg-blue-700 hover:bg-blue-800" onClick={handleSearch}>
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
                    Save your searches to quickly access them later. Click the "Save Search" button after setting up
                    your filters.
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
                          Search: <span className="font-medium">{search.filters.searchTerm}</span>
                        </p>
                      )}
                      {search.filters.language && (
                        <p>
                          Language: <span className="font-medium">{search.filters.language}</span>
                        </p>
                      )}
                      {search.filters.category && (
                        <p>
                          Category: <span className="font-medium">{search.filters.category}</span>
                        </p>
                      )}
                      <p>
                        Subscribers:{" "}
                        <span className="font-medium">
                          {search.filters.minSubscribers.toLocaleString()} -{" "}
                          {search.filters.maxSubscribers.toLocaleString()}
                        </span>
                      </p>
                      <p>
                        Avg. Views:{" "}
                        <span className="font-medium">
                          {search.filters.minViews.toLocaleString()} - {search.filters.maxViews.toLocaleString()}
                        </span>
                      </p>
                      {search.filters.uploadFrequency && (
                        <p>
                          Upload Frequency: <span className="font-medium">{search.filters.uploadFrequency}</span>
                        </p>
                      )}
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
                    Your search history will appear here after you perform searches.
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
                    <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{item.query}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleString()} • {item.results} results
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600"
                        onClick={() => {
                          setSearchTerm(item.query)
                          setActiveTab("search")
                          handleSearch()
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
  )
}
