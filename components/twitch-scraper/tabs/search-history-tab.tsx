"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import mock data
import { mockSearchHistory } from "../mock-data";

interface SearchHistoryTabProps {
  setSearchTerm: (value: string) => void;
  setActiveTab: (value: string) => void;
  handleSearch: () => void;
}

export default function SearchHistoryTab({
  setSearchTerm,
  setActiveTab,
  handleSearch,
}: SearchHistoryTabProps) {
  const [searchHistory, setSearchHistory] = useState(mockSearchHistory);

  return (
    <div>
      {searchHistory.length === 0 ? (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
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
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.query}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleString()} • {item.results}{" "}
                      results
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
    </div>
  );
}
