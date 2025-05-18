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
  Save,
  Download,
  ChevronDown,
  FileText,
  Check,
  FileSpreadsheet,
  FileJson,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const [selectedUsernames, setSelectedUsernames] = useState<
    Record<string, boolean>
  >({});
  const [exportFormat, setExportFormat] = useState("csv");
  const [searchName, setSearchName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  console.log(selectedUsernames);

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

  // Function to handle "Select All" checkbox change
  const handleSelectAllChange = (checked: boolean) => {
    const newSelectedUsernames: Record<string, boolean> = {};

    data.forEach((streamer) => {
      newSelectedUsernames[streamer.username] = checked;
    });

    setSelectedUsernames(newSelectedUsernames);
  };
  const handleCheckboxChange = (username: string, checked: boolean) => {
    setSelectedUsernames((prev) => ({
      ...prev,
      [username]: checked,
    }));
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
  // Apply sorting before pagination
  const sortedData = sortData(data);

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3 bg-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 ps-2">
            <Checkbox
              id="show-selected"
              checked={
                data.length > 0 &&
                data.every((s) => selectedUsernames[s.username])
              }
              onCheckedChange={(checked) =>
                handleSelectAllChange(checked === true)
              }
            />
            <label
              htmlFor="show-selected"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Across all pages
            </label>
          </div>
          <div className="text-sm text-gray-500">
            {Object.values(selectedUsernames).filter(Boolean).length} selected
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export as {exportFormat.toUpperCase()}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setExportFormat("csv")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    <span>CSV</span>
                    {exportFormat === "csv" && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setExportFormat("excel")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Excel</span>
                    {exportFormat === "excel" && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setExportFormat("json")}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileJson className="h-4 w-4" />
                    <span>JSON</span>
                    {exportFormat === "json" && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleExport}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Now</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={currentItems.every(
                    (item) => selectedUsernames[item.username]
                  )}
                  onCheckedChange={(checked) => {
                    const isChecked = checked === true;
                    const newSelectedRowIds = { ...selectedUsernames };
                    currentItems.forEach((item) => {
                      newSelectedRowIds[item.username] = isChecked;
                    });
                    setSelectedUsernames(newSelectedRowIds);
                  }}
                  aria-label="Select all"
                  className="ml-2"
                />
              </TableHead>
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
                  <TableCell>
                    <Checkbox
                      checked={!!selectedUsernames[row.username]}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(row.username, checked === true)
                      }
                      aria-label={`Select ${row.username}`}
                      className="ml-2"
                    />
                  </TableCell>
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
        <div className="flex justify-center py-4 bg-gray-100 border-t border-gray-200">
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
