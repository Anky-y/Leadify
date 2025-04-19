"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Import mock data
import { mockSavedSearches } from "../mock-data";
import type { SavedSearch } from "../types";

interface SavedSearchesTabProps {
  setSearchTerm: (value: string) => void;
  setLanguage: (value: string) => void;
  setCategory: (value: string) => void;
  setMinFollowers: (value: number) => void;
  setMaxFollowers: (value: number) => void;
  setMinViewers: (value: number) => void;
  setMaxViewers: (value: number) => void;
  setActiveTab: (value: string) => void;
  handleSearch: () => void;
}

export default function SavedSearchesTab({
  setSearchTerm,
  setLanguage,
  setCategory,
  setMinFollowers,
  setMaxFollowers,
  setMinViewers,
  setMaxViewers,
  setActiveTab,
  handleSearch,
}: SavedSearchesTabProps) {
  const [savedSearches, setSavedSearches] =
    useState<SavedSearch[]>(mockSavedSearches);
  const { toast } = useToast();

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

  return (
    <div>
      {savedSearches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="text-lg font-medium">No saved searches</h3>
              <p className="text-gray-500 max-w-md">
                Save your searches to quickly access them later. Click the "Save
                Search" button after setting up your filters.
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
    </div>
  );
}
