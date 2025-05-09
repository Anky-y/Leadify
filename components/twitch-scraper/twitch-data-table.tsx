"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DiscordLogo,
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  YoutubeLogo,
  EnvelopeSimple,
} from "./social-icons";
import {
  ExternalLink,
  Eye,
  EyeOff,
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowDown01,
  ArrowUp01,
  ArrowDownUp,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { TwitchData } from "./types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TwitchDataTableProps {
  data: TwitchData[];
  subscribed: boolean;
}

export default function TwitchDataTable({ data }: TwitchDataTableProps) {
  // State to track which emails are revealed
  const [revealedEmails, setRevealedEmails] = useState<Record<string, boolean>>(
    {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const subscribed = true;

  // Toggle email visibility for a specific row
  const toggleEmailVisibility = (id: string) => {
    setRevealedEmails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | "default"
  >("default");

  const handleSort = (column: string) => {
    // If clicking the same column, cycle through sort states: default -> asc -> desc -> default
    if (sortColumn === column) {
      if (sortDirection === "default") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortDirection("default");
        setSortColumn(null); // Reset column when returning to default
      }
    } else {
      // If clicking a new column, set it as the sort column with default ascending direction
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort the data based on current sort column and direction
  const sortData = (items: TwitchData[]) => {
    if (!sortColumn || sortDirection === "default") return items;

    return [...items].sort((a, b) => {
      // Handle different column types
      if (sortColumn === "username") {
        const valueA = a.username.toLowerCase();
        const valueB = b.username.toLowerCase();
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (sortColumn === "followers") {
        // Ensure we're working with numbers for correct sorting
        const valueA = Number(a.followers) || 0;
        const valueB = Number(b.followers) || 0;
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (sortColumn === "viewer_count") {
        // Ensure we're working with numbers for correct sorting
        const valueA = Number(a.viewer_count) || 0;
        const valueB = Number(b.viewer_count) || 0;
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (sortColumn === "gmail") {
        // Sort by presence of valid email
        const hasEmailA = Boolean(a.gmail);
        const hasEmailB = Boolean(b.gmail);

        if (hasEmailA === hasEmailB) {
          // If both have or don't have emails, sort alphabetically
          const valueA = (a.gmail || "").toLowerCase();
          const valueB = (b.gmail || "").toLowerCase();
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        // One has email and one doesn't
        return sortDirection === "asc"
          ? hasEmailA
            ? -1
            : 1
          : hasEmailA
          ? 1
          : -1;
      }

      return 0;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Apply sorting before pagination
  const sortedData = sortData(data);

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[180px] cursor-pointer"
                onClick={() => handleSort("username")}
              >
                <div className="flex items-center">
                  Username
                  <div className="ml-1">
                    {sortColumn === "username" ? (
                      sortDirection === "asc" ? (
                        <ArrowDownAZ className="h-4 w-4 text-blue-600" />
                      ) : sortDirection === "desc" ? (
                        <ArrowUpAZ className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ArrowDownUp className="h-4 w-4 text-gray-400" />
                      )
                    ) : (
                      <ArrowDownUp className="h-4 w-4 text-gray-400 opacity-50" />
                    )}
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("followers")}
              >
                <div className="flex items-center justify-end">
                  Followers
                  <div className="ml-1">
                    {sortColumn === "followers" ? (
                      sortDirection === "asc" ? (
                        <ArrowDown01 className="h-4 w-4 text-blue-600" />
                      ) : sortDirection === "desc" ? (
                        <ArrowUp01 className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ArrowDownUp className="h-4 w-4 text-gray-400" />
                      )
                    ) : (
                      <ArrowDownUp className="h-4 w-4 text-gray-400 opacity-50" />
                    )}
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => handleSort("viewer_count")}
              >
                <div className="flex items-center justify-end">
                  Viewers
                  <div className="ml-1">
                    {sortColumn === "viewer_count" ? (
                      sortDirection === "asc" ? (
                        <ArrowDown01 className="h-4 w-4 text-blue-600" />
                      ) : sortDirection === "desc" ? (
                        <ArrowUp01 className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ArrowDownUp className="h-4 w-4 text-gray-400" />
                      )
                    ) : (
                      <ArrowDownUp className="h-4 w-4 text-gray-400 opacity-50" />
                    )}
                  </div>
                </div>
              </TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Social Media</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("gmail")}
              >
                <div className="flex items-center">
                  Email
                  <div className="ml-1">
                    {sortColumn === "gmail" ? (
                      sortDirection === "asc" ? (
                        <SortAsc className="h-4 w-4 text-blue-600" />
                      ) : sortDirection === "desc" ? (
                        <SortDesc className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ArrowDownUp className="h-4 w-4 text-gray-400" />
                      )
                    ) : (
                      <ArrowDownUp className="h-4 w-4 text-gray-400 opacity-50" />
                    )}
                  </div>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No data found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((row) => (
                <TableRow key={row.username}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{row.username}</span>
                      <a
                        href={row.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                      >
                        View Channel
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {row.followers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.viewer_count.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.language}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.game_name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {row.discord && (
                        <a
                          href={subscribed ? row.discord : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            subscribed
                              ? "text-gray-500 hover:text-indigo-600"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                          title={subscribed ? "Discord" : "Upgrade to view"}
                          onClick={(e) => !subscribed && e.preventDefault()}
                        >
                          <DiscordLogo className="h-4 w-4" />
                        </a>
                      )}
                      {row.youtube && (
                        <a
                          href={row.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-red-600"
                          title="YouTube"
                        >
                          <YoutubeLogo className="h-4 w-4" />
                        </a>
                      )}
                      {row.twitter && (
                        <a
                          href={row.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-400"
                          title="Twitter"
                        >
                          <TwitterLogo className="h-4 w-4" />
                        </a>
                      )}
                      {row.facebook && (
                        <a
                          href={subscribed ? row.facebook : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            subscribed
                              ? "text-gray-500 hover:text-blue-600"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                          title={subscribed ? "Facebook" : "Upgrade to view"}
                          onClick={(e) => !subscribed && e.preventDefault()}
                        >
                          <FacebookLogo className="h-4 w-4" />
                        </a>
                      )}
                      {row.instagram && (
                        <a
                          href={subscribed ? row.instagram : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            subscribed
                              ? "text-gray-500 hover:text-pink-600"
                              : "text-gray-300 cursor-not-allowed"
                          }`}
                          title={subscribed ? "Instagram" : "Upgrade to view"}
                          onClick={(e) => !subscribed && e.preventDefault()}
                        >
                          <InstagramLogo className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.gmail ? (
                      subscribed || revealedEmails[row.id] ? (
                        <div className="flex items-center">
                          <a
                            href={`mailto:${row.gmail}`}
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <EnvelopeSimple className="h-4 w-4 mr-1" />
                            <span className="text-xs">{row.gmail}</span>
                          </a>
                          {!subscribed && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => toggleEmailVisibility(row.id)}
                              title="Hide email"
                            >
                              <EyeOff className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-gray-400 text-xs blur-sm select-none">
                            {row.gmail.replace(/./g, "•")}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => toggleEmailVisibility(row.id)}
                            title="Reveal email (free users get 3 reveals per day)"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Couldn't find a valid mail
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {data.length > itemsPerPage && (
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, and pages around current page
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis for gaps
                  if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
