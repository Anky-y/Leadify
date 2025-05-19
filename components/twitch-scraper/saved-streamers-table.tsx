"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { motion } from "framer-motion";
import { useUser } from "@/app/context/UserContext";

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
  console.log("asdasdasdasdad");
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

  const { user } = useUser();

  const itemsPerPage = 7;

  console.log(data);
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
        const valueA = new Date(a.savedAt || "").getTime();
        const valueB = new Date(b.savedAt || "").getTime();
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

  // Apply sorting and pagination
  const sortedData = sortData(data);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3 bg-gray-100">
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
              Select all
            </label>
          </div>
          <div className="text-sm text-gray-500">
            {Object.values(selectedStreamers).filter(Boolean).length} selected
          </div>
        </div>

        {Object.values(selectedStreamers).filter(Boolean).length > 0 && (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderClosed className="mr-2 h-4 w-4" />
                  Move to folder
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select folder</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => {
                      Object.entries(selectedStreamers).forEach(
                        ([id, selected]) => {
                          if (selected) {
                            onMoveToFolder(id, folder.name);
                          }
                        }
                      );
                      setSelectedStreamers({});
                    }}
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                Object.entries(selectedStreamers).forEach(([id, selected]) => {
                  if (selected) {
                    onDelete(id);
                  }
                });
                setSelectedStreamers({});
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete selected
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b border-gray-200">
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
              <TableHead className="w-[50px]"></TableHead>
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
              <TableHead>Email</TableHead>
              <TableHead>Folder</TableHead>
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
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center py-8 text-gray-500"
                >
                  No saved streamers found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((row, index) => (
                <motion.tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={tableRowVariants}
                >
                  <TableCell>
                    <Checkbox
                      checked={!!selectedStreamers[row.id]}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(row.id, checked === true)
                      }
                      aria-label={`Select ${row.username}`}
                      className="ml-2"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite(row.id, row.is_favourite)}
                    >
                      {row.is_favourite ? (
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
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
                          href={row.discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-indigo-600 transition-colors"
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
                          className="text-gray-500 hover:text-red-600 transition-colors"
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
                          className="text-gray-500 hover:text-blue-400 transition-colors"
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
                          className="text-gray-500 hover:text-blue-600 transition-colors"
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
                          className="text-gray-500 hover:text-pink-600 transition-colors"
                          title="Instagram"
                        >
                          <InstagramLogo className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.gmail ? (
                      <div className="flex items-center">
                        <a
                          href={`mailto:${row.gmail}`}
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <EnvelopeSimple className="h-4 w-4 mr-1" />
                          <span className="text-xs">{row.gmail}</span>
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No email available
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {row.folder_id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {row.savedAt
                          ? format(new Date(row.savedAt), "MMM d, yyyy")
                          : "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
                        <DropdownMenuLabel>Move to folder</DropdownMenuLabel>
                        {folders.map((folder) => (
                          <DropdownMenuItem
                            key={folder.id}
                            onClick={() => onMoveToFolder(row.id, folder.name)}
                            className="cursor-pointer"
                            disabled={row.folder_id === folder.id}
                          >
                            <FolderClosed className="mr-2 h-4 w-4" />
                            <span>{folder.name}</span>
                          </DropdownMenuItem>
                        ))}
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
