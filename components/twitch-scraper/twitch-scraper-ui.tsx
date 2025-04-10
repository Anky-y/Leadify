"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, RefreshCw, Save, Trash2 } from "lucide-react"
import TwitchDataTable from "./twitch-data-table"
import FilterSection from "./filter-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Mock data for demonstration
import { mockTwitchData } from "./mock-data"

// Types
interface SavedSearch {
  id: string
  name: string
  filters: {
    searchTerm: string
    language: string
    category: string
    minFollowers: number
    maxFollowers: number
    minViewers: number
    maxViewers: number
  }
}

export default function TwitchScraperUI() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [language, setLanguage] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [minFollowers, setMinFollowers] = useState<number>(1000)
  const [maxFollowers, setMaxFollowers] = useState<number>(10000000)
  const [minViewers, setMinViewers] = useState<number>(10)
  const [maxViewers, setMaxViewers] = useState<number>(100000)

  // State for UI
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(mockTwitchData)
  const [subscribed, setSubscribed] = useState(false)
  const [exportFormat, setExportFormat] = useState("csv")
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [searchName, setSearchName] = useState("")

  // State for saved searches
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  const { toast } = useToast()

  // Load saved searches from localStorage on component mount
  useEffect(() => {
    const savedSearchesFromStorage = localStorage.getItem("savedSearches")
    if (savedSearchesFromStorage) {
      setSavedSearches(JSON.parse(savedSearchesFromStorage))
    }
  }, [])

  // Save searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches))
  }, [savedSearches])

  const handleSearch = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Filter data based on search criteria
      const filteredData = mockTwitchData.filter((item) => {
        // Filter by search term
        if (searchTerm && !item.username.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false
        }

        // Filter by language
        if (language && item.language.toLowerCase() !== language.toLowerCase()) {
          return false
        }

        // Filter by category
        if (category && item.category.toLowerCase() !== category.toLowerCase()) {
          return false
        }

        // Filter by follower count
        if (item.followers < minFollowers || item.followers > maxFollowers) {
          return false
        }

        // Filter by viewer count
        if (item.viewers < minViewers || item.viewers > maxViewers) {
          return false
        }

        return true
      })

      // Apply result limit if not subscribed
      const limitedData = subscribed ? filteredData : filteredData.slice(0, 10)
      setData(limitedData)

      // Show toast with result count
      toast({
        title: "Search Results",
        description: `Found ${filteredData.length} results${!subscribed && filteredData.length > 10 ? `, showing 10 (upgrade to see all)` : ""}`,
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
    setMinFollowers(search.filters.minFollowers)
    setMaxFollowers(search.filters.maxFollowers)
    setMinViewers(search.filters.minViewers)
    setMaxViewers(search.filters.maxViewers)

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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-900 mb-4">
          Twitch Scraper
        </h1>
        <p className="text-gray-500 max-w-3xl">
          Find and filter Twitch streamers based on your specific requirements. Export data for your outreach campaigns.
        </p>
      </div>

      {!subscribed && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Free account limitations</AlertTitle>
          <AlertDescription>
            You're using a free account which limits results to 10 entries and masks contact information.{" "}
            <a href="/pricing" className="font-medium underline underline-offset-4">
              Upgrade your plan
            </a>{" "}
            to unlock unlimited results and full contact details.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="search" className="mb-6">
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="saved">
            Saved Searches {savedSearches.length > 0 && `(${savedSearches.length})`}
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
                setLanguage("")
                setCategory("")
                setMinFollowers(1000)
                setMaxFollowers(10000000)
                setMinViewers(10)
                setMaxViewers(100000)
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
                          placeholder="e.g., English Fortnite Streamers"
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
                  {data.length} results {!subscribed && data.length === 10 && mockTwitchData.length > 10 && "(limited)"}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="subscription-toggle" checked={subscribed} onCheckedChange={setSubscribed} />
                  <Label htmlFor="subscription-toggle" className="text-sm">
                    Simulate Premium Account
                  </Label>
                </div>
              </div>

              <TwitchDataTable data={data} subscribed={subscribed} />
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
                        Followers:{" "}
                        <span className="font-medium">
                          {search.filters.minFollowers.toLocaleString()} -{" "}
                          {search.filters.maxFollowers.toLocaleString()}
                        </span>
                      </p>
                      <p>
                        Viewers:{" "}
                        <span className="font-medium">
                          {search.filters.minViewers.toLocaleString()} - {search.filters.maxViewers.toLocaleString()}
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
      </Tabs>
    </div>
  )
}
