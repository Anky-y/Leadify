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
  SearchCheck,
  Download,
  ChevronDown,
  FileText,
  Check,
  FileSpreadsheet,
  FileJson,
  UserPlus,
  MoreHorizontal,
  Filter,
  Settings,
  Columns,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
import { exportToCSV, exportToExcel, exportToJSON } from "@/utils/export";
import { useUser } from "@/app/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
  const [saveStreamersDialogOpen, setSaveStreamersDialogOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    username: true,
    followers: true,
    viewers: true,
    language: true,
    category: true,
    social: true,
    email: true,
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [exportColumns, setExportColumns] = useState({ ...visibleColumns });
  const [exportOptionsDialogOpen, setExportOptionsDialogOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Adjust visible columns based on screen size
  useEffect(() => {
    if (isMobile) {
      setVisibleColumns({
        username: true,
        followers: true,
        viewers: false,
        language: false,
        category: false,
        social: true,
        email: true,
      });
    } else if (isTablet && !isDesktop) {
      setVisibleColumns({
        username: true,
        followers: true,
        viewers: true,
        language: true,
        category: false,
        social: true,
        email: true,
      });
    } else {
      setVisibleColumns({
        username: true,
        followers: true,
        viewers: true,
        language: true,
        category: true,
        social: true,
        email: true,
      });
    }
  }, [isDesktop, isTablet, isMobile]);

  const itemsPerPage = isDesktop ? 10 : isTablet ? 7 : 5;

  const subscribed = true;

  const { user } = useUser();
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
    const selected = Object.values(selectedUsernames).some(Boolean);
    const exportData = selected
      ? data.filter((row) => selectedUsernames[row.username])
      : data;

    console.log(exportData);

    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "Please perform a search first to get data for export.",
        variant: "destructive",
      });
      return;
    }

    // Pass column visibility to export functions
    if (exportFormat === "csv") {
      exportToCSV(exportData, "twitch-data.csv", visibleColumns);
    } else if (exportFormat === "json") {
      exportToJSON(exportData, "twitch-data.json", visibleColumns);
    } else if (exportFormat === "excel") {
      exportToExcel(exportData, "twitch-data.xlsx", visibleColumns);
    }

    toast({
      title: `Exporting data as ${exportFormat.toUpperCase()}`,
      description: `${exportData.length} records with ${
        Object.values(visibleColumns).filter(Boolean).length
      } columns will be exported.`,
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
    setSaveSearchDialogOpen(false);
    setSearchName("");
  };
  const handleSaveStreamers = async () => {
    console.log("here");
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
    const selected = Object.values(selectedUsernames).some(Boolean);
    const streamersToSave = selected
      ? data.filter((row) => selectedUsernames[row.username])
      : data;

    if (streamersToSave.length === 0) {
      toast({
        title: "No streamers selected",
        description: "Please select at least one streamer to save.",
        variant: "destructive",
      });
      return;
    }

    const cleanedStreamers = streamersToSave.map((streamer) => ({
      ...streamer,
      followers: Number(streamer.followers),
      viewer_count: Number(streamer.viewer_count),
      subscriber_count: Number(streamer.subscriber_count),
    }));

    console.log(cleanedStreamers);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/save?user_id=${user?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanedStreamers),
        }
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to save streamers");
      }

      toast({
        title: "Success",
        description: "Selected streamers have been saved to your list.",
      });

      setSaveStreamersDialogOpen(false);
      setSearchName(""); // Optional depending on whether name is reused
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong while saving streamers.",
        variant: "destructive",
      });
    }
  };

  console.log(data);
  // Apply sorting before pagination
  const sortedData = sortData(data);

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="border rounded-lg overflow-hidden shadow-sm bg-white"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="p-3 sm:p-4 border-b flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-gray-50 to-gray-100">
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
              {isTablet ? "Select all" : "All"}
            </label>
          </div>
          <div className="text-sm text-gray-500">
            {Object.values(selectedUsernames).filter(Boolean).length} selected
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3"
              >
                <Filter className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    username: !prev.username,
                  }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.username} />
                <span>Username</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    followers: !prev.followers,
                  }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.followers} />
                <span>Followers</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    viewers: !prev.viewers,
                  }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.viewers} />
                <span>Viewers</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    language: !prev.language,
                  }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.language} />
                <span>Language</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    category: !prev.category,
                  }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.category} />
                <span>Category</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    social: !prev.social,
                  }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.social} />
                <span>Social Media</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setVisibleColumns((prev) => ({ ...prev, email: !prev.email }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.email} />
                <span>Email</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog
            open={saveSearchDialogOpen}
            onOpenChange={setSaveSearchDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <SearchCheck className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Save Search</span>
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
                  onClick={() => setSaveSearchDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveSearch}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog
            open={saveStreamersDialogOpen}
            onOpenChange={setSaveStreamersDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Save Selected</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Selected Streamers</DialogTitle>
                <DialogDescription>
                  All currently selected streamers will be saved to your saved
                  list.
                  <br />
                  <span className="text-sm text-muted-foreground">
                    Streamers that are already saved will be skipped
                    automatically.
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSaveStreamersDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveStreamers}>Confirm Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center gap-1 sm:gap-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    Export as {exportFormat.toUpperCase()}
                  </span>
                  <span className="inline sm:hidden">Export</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-0 sm:ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setExportFormat("csv");
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>CSV</span>
                  {exportFormat === "csv" && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setExportFormat("excel");
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel</span>
                  {exportFormat === "excel" && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setExportFormat("json");
                  }}
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
                  onClick={() => {
                    // Reset export columns to match current visible columns
                    setExportColumns({ ...visibleColumns });
                    setExportOptionsDialogOpen(true);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>Advanced Export</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleExport}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Quick Export</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <Dialog
        open={exportOptionsDialogOpen}
        onOpenChange={setExportOptionsDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Options</DialogTitle>
            <DialogDescription>
              Select which columns to include in your export. The export will
              use the {exportFormat.toUpperCase()} format.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Columns to Export</Label>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExportColumns(
                        Object.fromEntries(
                          Object.keys(exportColumns).map((key) => [key, true])
                        ) as typeof exportColumns
                      )
                    }
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExportColumns(
                        Object.fromEntries(
                          Object.keys(exportColumns).map((key) => [key, false])
                        ) as typeof exportColumns
                      )
                    }
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(exportColumns).map(([column, isChecked]) => (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox
                      id={`export-${column}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        setExportColumns((prev) => ({
                          ...prev,
                          [column]: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor={`export-${column}`} className="capitalize">
                      {column === "viewers" ? "Viewers" : column}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportOptionsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleExport();
                setExportOptionsDialogOpen(false);
              }}
            >
              Export Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
            <TableRow className="border-b border-gray-200 hover:bg-transparent">
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
              {visibleColumns.username && (
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
              )}
              {visibleColumns.followers && (
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
              )}
              {visibleColumns.viewers && (
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
              )}
              {visibleColumns.language && <TableHead>Language</TableHead>}
              {visibleColumns.category && <TableHead>Category</TableHead>}
              {visibleColumns.social && <TableHead>Social Media</TableHead>}
              {visibleColumns.email && (
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
              )}
              {!isMobile && (
                <TableHead className="w-[50px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    Object.values(visibleColumns).filter(Boolean).length + 2
                  }
                  className="text-center py-8 text-gray-500"
                >
                  No data found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {currentItems.map((row, index) => (
                  <motion.tr
                    key={row.username}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={tableRowVariants}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    <TableCell className="py-2 sm:py-3">
                      <Checkbox
                        checked={!!selectedUsernames[row.username]}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(row.username, checked === true)
                        }
                        aria-label={`Select ${row.username}`}
                        className="ml-2"
                      />
                    </TableCell>
                    {visibleColumns.username && (
                      <TableCell className="font-medium py-2 sm:py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {row.username}
                          </span>
                          <a
                            href={row.channelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center mt-1 group"
                          >
                            View Channel
                            <ExternalLink className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.followers && (
                      <TableCell className="text-right py-2 sm:py-3 font-medium text-gray-700">
                        {row.followers.toLocaleString()}
                      </TableCell>
                    )}
                    {visibleColumns.viewers && (
                      <TableCell className="text-right py-2 sm:py-3 font-medium text-gray-700">
                        {row.viewer_count.toLocaleString()}
                      </TableCell>
                    )}
                    {visibleColumns.language && (
                      <TableCell className="py-2 sm:py-3">
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-700"
                        >
                          {row.language}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.category && (
                      <TableCell className="py-2 sm:py-3">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 border-blue-100"
                        >
                          {row.game_name}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.social && (
                      <TableCell className="py-2 sm:py-3">
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
                              } transition-colors duration-200 p-1 rounded-full hover:bg-gray-100`}
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
                              className="text-gray-500 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
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
                              className="text-gray-500 hover:text-blue-400 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
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
                              } transition-colors duration-200 p-1 rounded-full hover:bg-gray-100`}
                              title={
                                subscribed ? "Facebook" : "Upgrade to view"
                              }
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
                              } transition-colors duration-200 p-1 rounded-full hover:bg-gray-100`}
                              title={
                                subscribed ? "Instagram" : "Upgrade to view"
                              }
                              onClick={(e) => !subscribed && e.preventDefault()}
                            >
                              <InstagramLogo className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.email && (
                      <TableCell className="py-2 sm:py-3">
                        {row.gmail ? (
                          subscribed || revealedEmails[row.id] ? (
                            <div className="flex items-center">
                              <a
                                href={`mailto:${row.gmail}`}
                                className="text-blue-600 hover:underline flex items-center group"
                              >
                                <EnvelopeSimple className="h-4 w-4 mr-1 group-hover:text-blue-700" />
                                <span className="text-xs truncate max-w-[120px] sm:max-w-[180px]">
                                  {row.gmail}
                                </span>
                              </a>
                              {!subscribed && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 ml-1 hover:bg-gray-100"
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
                                className="h-6 w-6 ml-1 hover:bg-gray-100"
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
                    )}
                    {!isMobile && (
                      <TableCell className="py-2 sm:py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleCheckboxChange(
                                  row.username,
                                  !selectedUsernames[row.username]
                                )
                              }
                              className="cursor-pointer"
                            >
                              {selectedUsernames[row.username] ? (
                                <>
                                  <Checkbox className="mr-2" checked />
                                  <span>Deselect</span>
                                </>
                              ) : (
                                <>
                                  <Checkbox className="mr-2" />
                                  <span>Select</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(row.channelUrl, "_blank")
                              }
                              className="cursor-pointer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              <span>View Channel</span>
                            </DropdownMenuItem>
                            {row.gmail && (
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(`mailto:${row.gmail}`, "_blank")
                                }
                                className="cursor-pointer"
                              >
                                <EnvelopeSimple className="mr-2 h-4 w-4" />
                                <span>Send Email</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
      {data.length > itemsPerPage && (
        <div className="flex justify-center py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
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
                      : "cursor-pointer hover:bg-gray-100 transition-colors"
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
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
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
                      : "cursor-pointer hover:bg-gray-100 transition-colors"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </motion.div>
  );
}
