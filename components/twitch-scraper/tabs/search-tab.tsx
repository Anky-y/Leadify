"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, RefreshCw, Save, PlusCircle } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import components
import FilterSection from "../filter-section";
import TwitchDataTable from "../twitch-data-table";

// Import types
import type { TwitchData } from "../types";

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
  // New props for detailed progress tracking
  currentStage: ScrapingStage;
  statusMessage: string;
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
  // New props for detailed progress tracking
  currentStage,
  statusMessage,
}: SearchTabProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [showAddToCrmDialog, setShowAddToCrmDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");

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

  // Helper function to render the progress details
  const renderProgressDetails = () => {
    if (!isLoading) return null;

    const { name, description, itemsProcessed, totalItems } = currentStage;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">{name}</div>
          {totalItems > 0 && (
            <div className="text-sm font-medium">
              {itemsProcessed}/{totalItems}
            </div>
          )}
        </div>
        <Progress value={loadingProgress} className="h-2" />
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>{description}</div>
          <div>{Math.round(loadingProgress)}%</div>
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

          {data.length > 0 ? (
            <>
              {isLoading ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center space-y-4 w-full max-w-md">
                      <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                      <h3 className="text-lg font-medium">
                        {statusMessage || "Updating results..."}
                      </h3>
                      <div className="w-full mx-auto mt-4">
                        {renderProgressDetails()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <TwitchDataTable data={data} subscribed={subscribed} />
              )}
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
                        Add these {data.length} Twitch streamers to your CRM as
                        leads.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-gray-500">
                        This will add all {data.length} streamers from your
                        current search results to your CRM. You can manage these
                        leads, add them to email sequences, and track your
                        outreach from the CRM dashboard.
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
                <div className="text-center space-y-4 w-full max-w-md">
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
                      <h3 className="text-lg font-medium">
                        {statusMessage || "Searching..."}
                      </h3>
                      <div className="w-full mx-auto mt-4">
                        {renderProgressDetails()}
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
