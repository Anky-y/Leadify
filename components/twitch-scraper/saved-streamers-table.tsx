"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { useState, useEffect, useRef } from "react";
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
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowDown01,
  ArrowUp01,
  ArrowDownUp,
  MoreHorizontal,
  Trash2,
  FolderClosed,
  Calendar,
  Star,
  StarOff,
  Filter,
  Settings,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Check,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import type { Folder, TwitchData } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/app/context/UserContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { exportToCSV, exportToExcel, exportToJSON } from "@/utils/export";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface SavedStreamersTableProps {
  data: TwitchData[];
  folders: Folder[];
  onDelete: (id: string) => void;
  onMoveToFolder: (id: string, folder: string) => void;
  refreshStreamers: () => void;
}

export default function SavedStreamersTable({
  data,
  folders,
  onDelete,
  onMoveToFolder,
  refreshStreamers,
}: SavedStreamersTableProps) {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [menuMeasured, setMenuMeasured] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedStreamers, setSelectedStreamers] = useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | "default"
  >("default");
  const [favoriteStreamers, setFavoriteStreamers] = useState<
    Record<string, boolean>
  >({});
  const [visibleColumns, setVisibleColumns] = useState({
    favorite: true,
    username: true,
    followers: true,
    viewers: true,
    language: true,
    category: true,
    social: true,
    email: true,
    folder: true,
    date: true,
  });

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    row: TwitchData | null;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    row: null,
    visible: false,
  });

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [exportFormat, setExportFormat] = useState("csv");
  const [exportColumns, setExportColumns] = useState({ ...visibleColumns });
  const [exportOptionsDialogOpen, setExportOptionsDialogOpen] = useState(false);

  // Adjust visible columns based on screen size
  useEffect(() => {
    if (isMobile) {
      setVisibleColumns({
        favorite: true,
        username: true,
        followers: true,
        viewers: false,
        language: false,
        category: false,
        social: false,
        email: true,
        folder: true,
        date: false,
      });
    } else if (isTablet && !isDesktop) {
      setVisibleColumns({
        favorite: true,
        username: true,
        followers: true,
        viewers: true,
        language: true,
        category: false,
        social: true,
        email: true,
        folder: true,
        date: false,
      });
    } else {
      setVisibleColumns({
        favorite: true,
        username: true,
        followers: true,
        viewers: true,
        language: true,
        category: true,
        social: true,
        email: true,
        folder: true,
        date: true,
      });
    }
  }, [isDesktop, isTablet, isMobile]);

  console.log(data);

  const { user } = useUser();

  const itemsPerPage = isDesktop ? 10 : isTablet ? 7 : 5;

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu.visible]);

  useEffect(() => {
    if (contextMenu.visible && contextMenuRef.current && !menuMeasured) {
      const menu = contextMenuRef.current;
      const rect = menu.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;
      let newX = contextMenu.x;
      let newY = contextMenu.y;

      if (contextMenu.x + rect.width > innerWidth) {
        newX = Math.max(innerWidth - rect.width - 8, 8);
      }
      if (contextMenu.y + rect.height > innerHeight) {
        newY = Math.max(innerHeight - rect.height - 8, 8);
      }

      if (newX !== menuPosition.x || newY !== menuPosition.y) {
        setMenuPosition({ x: newX, y: newY });
      }
      setMenuMeasured(true);
    }
  }, [
    contextMenu.visible,
    menuMeasured,
    contextMenu.x,
    contextMenu.y,
    menuPosition.x,
    menuPosition.y,
  ]);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "default") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortDirection("default");
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort the data based on current sort column and direction
  const sortData = (items: TwitchData[]) => {
    if (!sortColumn || sortDirection === "default") return items;

    return [...items].sort((a, b) => {
      if (sortColumn === "username") {
        const valueA = a.username.toLowerCase();
        const valueB = b.username.toLowerCase();
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (sortColumn === "followers") {
        const valueA = Number(a.followers) || 0;
        const valueB = Number(b.followers) || 0;
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (sortColumn === "viewer_count") {
        const valueA = Number(a.viewer_count) || 0;
        const valueB = Number(b.viewer_count) || 0;
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (sortColumn === "savedAt") {
        const valueA = new Date(a.saved_at || "").getTime();
        const valueB = new Date(b.saved_at || "").getTime();
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle select all checkbox
  const handleSelectAllChange = (checked: boolean) => {
    const newSelectedStreamers: Record<string, boolean> = {};
    currentItems.forEach((streamer) => {
      newSelectedStreamers[streamer.id] = checked;
    });
    setSelectedStreamers(newSelectedStreamers);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedStreamers((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  // Toggle favorite status
  const toggleFavorite = async (
    streamerId: string,
    currentStatus: boolean | undefined
  ) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (user?.id) {
      headers["x-user-id"] = user.id;
    }
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/favourite`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        streamer_id: streamerId,
        is_favourite: !currentStatus,
      }),
    });

    // Re-fetch streamers to update UI (or just optimistically update `row.is_favourite` if needed)
    refreshStreamers(); // <- Your data refresh function here
  };

  const handleExport = () => {
    const selected = Object.values(selectedStreamers).some(Boolean);
    const exportData = selected
      ? data.filter((row) => selectedStreamers[row.id])
      : data;

    if (data.length === 0) {
      toast.error("There are no saved streamers to export.");
      return;
    }

    // Check subscription plan for export permissions
    if (exportFormat === "json" && user?.subscription_plan === "Free") {
      toast.error("JSON export is only available on Basic and Pro plans", {
        description: "Upgrade your subscription to access this feature",
        action: {
          label: "Upgrade",
          onClick: () => (window.location.href = "/dashboard/billing"),
        },
      });
      return;
    }

    if (exportFormat === "excel" && user?.subscription_plan !== "Pro") {
      toast.error("Excel export is only available on Pro plans", {
        description: "Upgrade your subscription to access this feature",
        action: {
          label: "Upgrade",
          onClick: () => (window.location.href = "/dashboard/billing"),
        },
      });
      return;
    }

    // Pass column visibility to export functions
    if (exportFormat === "csv") {
      exportToCSV(exportData, "saved-streamers.csv", exportColumns);
      toast.success(`Exported ${exportData.length} records as CSV`);
    } else if (exportFormat === "json") {
      exportToJSON(exportData, "saved-streamers.json", exportColumns);
      toast.success(`Exported ${exportData.length} records as JSON`);
    } else if (exportFormat === "excel") {
      exportToExcel(exportData, "saved-streamers.xlsx", exportColumns);
      toast.success(`Exported ${exportData.length} records as Excel`);
    }
  };

  // Apply sorting and pagination
  const sortedData = sortData(data);
  console.log(sortedData);
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

  console.log(data);
  console.log(currentItems);

  return (
    <motion.div
      className="border rounded-lg overflow-hidden shadow-sm bg-white w-full"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="p-3 sm:p-4 border-b flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 ps-2">
            <Checkbox
              id="select-all"
              checked={
                currentItems.length > 0 &&
                currentItems.every((s) => selectedStreamers[s.id])
              }
              onCheckedChange={(checked) =>
                handleSelectAllChange(checked === true)
              }
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {isTablet ? "Select all" : "All"}
            </label>
          </div>
          <div className="text-sm text-gray-500">
            {Object.values(selectedStreamers).filter(Boolean).length} selected
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
                    favorite: !prev.favorite,
                  }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.favorite} />
                <span>Favorite</span>
              </DropdownMenuItem>
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
              <DropdownMenuItem
                onClick={() =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    folder: !prev.folder,
                  }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.folder} />
                <span>Folder</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setVisibleColumns((prev) => ({ ...prev, date: !prev.date }))
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox checked={visibleColumns.date} />
                <span>Date</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 border-blue-200 text-blue-700 hover:bg-blue-50 ml-2 ${
                  (exportFormat === "json" &&
                    user?.subscription_plan === "Free") ||
                  (exportFormat === "excel" &&
                    user?.subscription_plan !== "Pro")
                    ? "border-red-200 text-red-700 hover:bg-red-50"
                    : ""
                }`}
              >
                <Download className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  Export as {exportFormat.toUpperCase()}
                  {(exportFormat === "json" &&
                    user?.subscription_plan === "Free") ||
                  (exportFormat === "excel" &&
                    user?.subscription_plan !== "Pro")
                    ? " (Upgrade)"
                    : ""}
                </span>
                <ChevronDown className="h-3.5 w-3.5 ml-0 sm:ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
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
                <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">
                  Free
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  if (user?.subscription_plan === "Free") {
                    toast.error(
                      "JSON export is only available on Basic and Pro plans",
                      {
                        description:
                          "Upgrade your subscription to access this feature",
                        action: {
                          label: "Upgrade",
                          onClick: () =>
                            (window.location.href = "/dashboard/billing"),
                        },
                      }
                    );
                    return;
                  }
                  setExportFormat("json");
                }}
                className={`flex items-center gap-2 ${
                  user?.subscription_plan === "Free"
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <FileJson className="h-4 w-4" />
                <span>JSON</span>
                {exportFormat === "json" &&
                  user?.subscription_plan !== "Free" && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                <Badge className="ml-auto bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Basic+
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  if (user?.subscription_plan !== "Pro") {
                    toast.error("Excel export is only available on Pro plans", {
                      description:
                        "Upgrade your subscription to access this feature",
                      action: {
                        label: "Upgrade",
                        onClick: () =>
                          (window.location.href = "/dashboard/billing"),
                      },
                    });
                    return;
                  }
                  setExportFormat("excel");
                }}
                className={`flex items-center gap-2 ${
                  user?.subscription_plan !== "Pro"
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
                {exportFormat === "excel" &&
                  user?.subscription_plan === "Pro" && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                <Badge className="ml-auto bg-purple-100 text-purple-800 hover:bg-purple-100">
                  Pro
                </Badge>
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

          <Dialog
            open={exportOptionsDialogOpen}
            onOpenChange={setExportOptionsDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Export Options</DialogTitle>
                <DialogDescription>
                  Select which columns to include in your export. The export
                  will use the {exportFormat.toUpperCase()} format.
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
                              Object.keys(exportColumns).map((key) => [
                                key,
                                true,
                              ])
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
                              Object.keys(exportColumns).map((key) => [
                                key,
                                false,
                              ])
                            ) as typeof exportColumns
                          )
                        }
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(exportColumns).map(
                      ([column, isChecked]) => (
                        <div
                          key={column}
                          className="flex items-center space-x-2"
                        >
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
                          <Label
                            htmlFor={`export-${column}`}
                            className="capitalize"
                          >
                            {column === "viewers" ? "Viewers" : column}
                          </Label>
                        </div>
                      )
                    )}
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

          {Object.values(selectedStreamers).filter(Boolean).length > 0 && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3"
                  >
                    <FolderClosed className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Move to folder</span>
                    <span className="inline sm:hidden">Move</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    Move to folder
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </DropdownMenuLabel>
                  <div className="max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {folders
                      .filter(
                        (folder) =>
                          folder.id !== "all" && folder.id !== "favourites"
                      )
                      .slice(0, 4)
                      .map((folder) => (
                        <DropdownMenuItem
                          key={folder.id}
                          onClick={() => {
                            Object.entries(selectedStreamers).forEach(
                              ([id, selected]) => {
                                if (selected) {
                                  onMoveToFolder(id, folder.id);
                                }
                              }
                            );
                            setSelectedStreamers({});
                          }}
                          className="cursor-pointer"
                        >
                          <FolderClosed className="mr-2 h-4 w-4" />
                          <span>{folder.name}</span>
                        </DropdownMenuItem>
                      ))}
                    {folders
                      .filter(
                        (folder) =>
                          folder.id !== "all" && folder.id !== "favourites"
                      )
                      .slice(4)
                      .map((folder) => (
                        <DropdownMenuItem
                          key={folder.id}
                          onClick={() => {
                            Object.entries(selectedStreamers).forEach(
                              ([id, selected]) => {
                                if (selected) {
                                  onMoveToFolder(id, folder.id);
                                }
                              }
                            );
                            setSelectedStreamers({});
                          }}
                          className="cursor-pointer"
                        >
                          <FolderClosed className="mr-2 h-4 w-4" />
                          <span>{folder.name}</span>
                        </DropdownMenuItem>
                      ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  Object.entries(selectedStreamers).forEach(
                    ([id, selected]) => {
                      if (selected) {
                        onDelete(id);
                      }
                    }
                  );
                  setSelectedStreamers({});
                }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Delete selected</span>
                <span className="inline sm:hidden">Delete</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
            <TableRow className="border-b border-gray-200 hover:bg-transparent">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    currentItems.length > 0 &&
                    currentItems.every((item) => selectedStreamers[item.id])
                  }
                  onCheckedChange={(checked) =>
                    handleSelectAllChange(checked === true)
                  }
                  aria-label="Select all"
                  className="ml-2"
                />
              </TableHead>
              {visibleColumns.favorite && (
                <TableHead className="w-[50px]"></TableHead>
              )}
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
              {visibleColumns.email && <TableHead>Email</TableHead>}
              {visibleColumns.folder && <TableHead>Folder</TableHead>}
              {visibleColumns.date && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("savedAt")}
                >
                  <div className="flex items-center">
                    Saved Date
                    <div className="ml-1">
                      {sortColumn === "savedAt" ? (
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
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    Object.values(visibleColumns).filter(Boolean).length + 2
                  }
                  className="text-center py-8 text-gray-500"
                >
                  No saved streamers found.
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {currentItems.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setMenuMeasured(false);
                      setMenuPosition({ x: e.clientX, y: e.clientY });
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        row: row,
                        visible: true,
                      });
                    }}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150"
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={tableRowVariants}
                  >
                    <TableCell className="py-2 sm:py-3">
                      <Checkbox
                        checked={!!selectedStreamers[row.id]}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(row.id, checked === true)
                        }
                        aria-label={`Select ${row.username}`}
                        className="ml-2"
                      />
                    </TableCell>
                    {visibleColumns.favorite && (
                      <TableCell className="py-2 sm:py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100 transition-colors duration-150"
                          onClick={() =>
                            toggleFavorite(row.id, row.is_favourite)
                          }
                        >
                          {row.is_favourite ? (
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ) : (
                            <StarOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                    )}
                    {visibleColumns.username && (
                      <TableCell className="font-medium py-2 sm:py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {row.username}
                          </span>
                          <a
                            href={row.channel_url}
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
                              href={row.discord}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                              title="Discord"
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
                              href={row.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                              title="Facebook"
                            >
                              <FacebookLogo className="h-4 w-4" />
                            </a>
                          )}
                          {row.instagram && (
                            <a
                              href={row.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-pink-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                              title="Instagram"
                            >
                              <InstagramLogo className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.email && (
                      <TableCell className="py-2 sm:py-3 max-w-[150px] truncate">
                        {row.gmail ? (
                          <div className="flex items-center">
                            <a
                              href={`mailto:${row.gmail}`}
                              className="text-blue-600 hover:underline flex items-center truncate group"
                            >
                              <EnvelopeSimple className="h-4 w-4 mr-1 flex-shrink-0 group-hover:text-blue-700" />
                              <span className="text-xs truncate">
                                {row.gmail}
                              </span>
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No email available
                          </span>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.folder && (
                      <TableCell className="py-2 sm:py-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {row.folder_id
                            ? folders.find((f) => f.id === row.folder_id)?.name
                            : "N/A"}
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.date && (
                      <TableCell className="py-2 sm:py-3">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {row.saved_at
                              ? format(new Date(row.saved_at), "MMM d, yyyy")
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="py-2 sm:py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100 transition-colors duration-150"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              toggleFavorite(row.id, row.is_favourite)
                            }
                            className="cursor-pointer"
                          >
                            {row.is_favourite ? (
                              <>
                                <StarOff className="mr-2 h-4 w-4" />
                                <span>Remove from favorites</span>
                              </>
                            ) : (
                              <>
                                <Star className="mr-2 h-4 w-4" />
                                <span>Add to favorites</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="flex justify-between items-center">
                            Move to folder
                          </DropdownMenuLabel>
                          <div className="max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            {folders
                              .filter(
                                (folder) =>
                                  folder.id !== "all" &&
                                  folder.id !== "favourites"
                              )
                              .slice(0, 4)
                              .map((folder) => (
                                <DropdownMenuItem
                                  key={folder.id}
                                  onClick={() =>
                                    onMoveToFolder(row.id, folder.id)
                                  }
                                  className="cursor-pointer"
                                  disabled={row.folder_id === folder.id}
                                >
                                  <FolderClosed className="mr-2 h-4 w-4" />
                                  <span>{folder.name}</span>
                                </DropdownMenuItem>
                              ))}
                            {folders
                              .filter(
                                (folder) =>
                                  folder.id !== "all" &&
                                  folder.id !== "favourites"
                              )
                              .slice(4)
                              .map((folder) => (
                                <DropdownMenuItem
                                  key={folder.id}
                                  onClick={() =>
                                    onMoveToFolder(row.id, folder.id)
                                  }
                                  className="cursor-pointer"
                                  disabled={row.folder_id === folder.id}
                                >
                                  <FolderClosed className="mr-2 h-4 w-4" />
                                  <span>{folder.name}</span>
                                </DropdownMenuItem>
                              ))}
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(row.id)}
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
      {contextMenu.visible && contextMenu.row && (
        <motion.div
          ref={contextMenuRef}
          className="fixed z-50 bg-white border shadow-lg rounded-md overflow-hidden"
          style={{ top: menuPosition.y, left: menuPosition.x }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="py-1 text-sm">
            <div className="px-3 py-2 font-medium text-gray-700 border-b">
              {contextMenu.row.username}
            </div>

            {/* Select/Deselect */}
            <div
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              onClick={() => {
                handleCheckboxChange(
                  contextMenu.row!.id,
                  !selectedStreamers[contextMenu.row!.id]
                );
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
            >
              {selectedStreamers[contextMenu.row.id] ? (
                <>
                  <Checkbox className="h-4 w-4" checked />
                  <span>Deselect</span>
                </>
              ) : (
                <>
                  <Checkbox className="h-4 w-4" />
                  <span>Select</span>
                </>
              )}
            </div>

            {/* View Channel */}
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              onClick={() => {
                window.open(contextMenu.row!.channel_url, "_blank");
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Channel</span>
            </button>

            {/* Favorite/Unfavorite */}
            <div
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              onClick={() => {
                toggleFavorite(
                  contextMenu.row!.id,
                  contextMenu.row!.is_favourite
                );
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
            >
              {contextMenu.row.is_favourite ? (
                <>
                  <StarOff className="h-4 w-4 text-yellow-400" />
                  <span>Remove from favorites</span>
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>Add to favorites</span>
                </>
              )}
            </div>

            {/* Move to folder */}
            <div className="border-t my-1" />
            <div className="px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
              <span>Add to folders</span>
              {/* <ChevronDown className="h-3 w-3 text-gray-400" /> */}
            </div>
            <div className="max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {folders
                .filter(
                  (folder) => folder.id !== "all" && folder.id !== "favourites"
                )
                .slice(0, 3)
                .map((folder) => (
                  <button
                    key={folder.id}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors hover:bg-gray-50 ${
                      contextMenu.row?.folder_id === folder.id
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (contextMenu.row?.folder_id !== folder.id) {
                        onMoveToFolder(contextMenu.row!.id, folder.id);
                      }
                      setContextMenu((prev) => ({ ...prev, visible: false }));
                    }}
                    disabled={contextMenu.row?.folder_id === folder.id}
                  >
                    <FolderClosed className="h-4 w-4" />
                    <span>{folder.name}</span>
                  </button>
                ))}
              {/* {folders.length > 5 && (
                <div className="px-4 py-2 text-xs text-gray-500 border-t">
                  Scroll for more folders
                </div>
              )} */}
              {folders
                .filter(
                  (folder) => folder.id !== "all" && folder.id !== "favourites"
                )
                .slice(3)
                .map((folder) => (
                  <button
                    key={folder.id}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors hover:bg-gray-50 ${
                      contextMenu.row?.folder_id === folder.id
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      if (contextMenu.row?.folder_id !== folder.id) {
                        onMoveToFolder(contextMenu.row!.id, folder.id);
                      }
                      setContextMenu((prev) => ({ ...prev, visible: false }));
                    }}
                    disabled={contextMenu.row?.folder_id === folder.id}
                  >
                    <FolderClosed className="h-4 w-4" />
                    <span>{folder.name}</span>
                  </button>
                ))}
            </div>

            {/* Delete */}
            <div className="border-t my-1" />
            <button
              className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 transition-colors text-red-600"
              onClick={() => {
                onDelete(contextMenu.row!.id);
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </motion.div>
      )}

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
