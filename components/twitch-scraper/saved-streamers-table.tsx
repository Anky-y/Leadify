"use client";

import type React from "react";

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
  ChevronDown,
  FileText,
  Check,
  FileSpreadsheet,
  FileJson,
  Share2,
  Mail,
  ChevronUp,
  Unlock,
  Loader2,
  AlertTriangle,
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
  canAccessFeature,
  revealSocialLinks,
  revealEmail,
  showUpgradeToast,
} from "@/utils/reveal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedStreamersTableProps {
  data: TwitchData[];
  folders: Folder[];
  onDelete: (id: string) => Promise<void>;
  onMoveToFolder: (id: string, folder: string) => Promise<void>;
  refreshStreamers: () => void;
  setFolders: (folders: Folder[]) => void;
}

export default function SavedStreamersTable({
  data,
  folders,
  setFolders,
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

  const [revealedSocials, setRevealedSocials] = useState<
    Record<string, boolean>
  >({});
  const [revealedEmails, setRevealedEmails] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedEmails, setExpandedEmails] = useState<Record<string, boolean>>(
    {}
  );

  // Bulk reveal loading states
  const [bulkRevealingSocials, setBulkRevealingSocials] = useState(false);
  const [bulkRevealingEmails, setBulkRevealingEmails] = useState(false);

  // Confirmation dialogs
  const [bulkSocialsConfirmOpen, setBulkSocialsConfirmOpen] = useState(false);
  const [bulkEmailsConfirmOpen, setBulkEmailsConfirmOpen] = useState(false);

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

  const { user, updateCredits } = useUser();
  const [savedStreamers, setSavedStreamers] = useState<TwitchData[]>(data);

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
    // Check if email sorting is restricted
    if (
      column === "email" &&
      !canAccessFeature("email", user?.subscription_plan)
    ) {
      showUpgradeToast("email");
      return;
    }

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

      // Email sorting (Basic only)
      if (sortColumn === "email") {
        const valueA = (a.gmail || "").toString().toLowerCase();
        const valueB = (b.gmail || "").toString().toLowerCase();
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fixed: Handle select all checkbox - now selects ALL streamers across all pages
  const handleSelectAllChange = (checked: boolean) => {
    const newSelectedStreamers: Record<string, boolean> = {};
    // Select ALL streamers, not just current page
    savedStreamers.forEach((streamer) => {
      newSelectedStreamers[streamer.id] = checked;
    });
    setSelectedStreamers(newSelectedStreamers);
  };

  // Handler for "Select all" (across all pages)
  const handleSelectAllGlobalChange = (checked: boolean) => {
    const newSelected: Record<string, boolean> = {};
    savedStreamers.forEach((streamer) => {
      newSelected[streamer.id] = checked;
    });
    setSelectedStreamers(newSelected);
  };

  // Handler for "Select page" (current page only)
  const handleSelectAllPageChange = (checked: boolean) => {
    setSelectedStreamers((prev) => {
      const updated = { ...prev };
      currentItems.forEach((streamer) => {
        updated[streamer.id] = checked;
      });
      return updated;
    });
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedStreamers((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  // Toggle favorite status with optimistic updates
  const toggleFavorite = async (
    streamerId: string,
    currentStatus: boolean | undefined
  ) => {
    // Check if favoriting is available for user tier
    if (!canAccessFeature("favorite", user?.subscription_plan)) {
      showUpgradeToast("favorite");
      return;
    }

    const newStatus = !currentStatus;

    // Optimistic update - update UI immediately
    setSavedStreamers((prev) =>
      prev.map((streamer) =>
        streamer.id === streamerId
          ? { ...streamer, is_favourite: newStatus }
          : streamer
      )
    );

    // Optimistic update - update folder count
    const newFolders = folders.map((folder) =>
      folder.id === "favourites"
        ? {
            ...folder,
            streamer_count: (folder.streamer_count || 0) + (newStatus ? 1 : -1),
          }
        : folder
    );

    setFolders(newFolders);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        headers["x-user-id"] = user.id;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/favourite`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            streamer_id: streamerId,
            is_favourite: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }

      // Show success feedback
      toast.success(
        newStatus ? "Added to favorites" : "Removed from favorites",
        {
          description: newStatus
            ? "This streamer is now in your favorites list"
            : "This streamer has been removed from favorites",
          icon: newStatus ? "⭐" : "☆",
          closeButton: true,
          duration: 3000,
        }
      );
    } catch (error) {
      // Revert optimistic update on error
      setSavedStreamers((prev) =>
        prev.map((streamer) =>
          streamer.id === streamerId
            ? { ...streamer, is_favourite: currentStatus }
            : streamer
        )
      );

      toast.error("Failed to update favorite status", {
        description: "Please try again or check your connection",
        icon: "❌",
        closeButton: true,
        action: {
          label: "Retry",
          onClick: () => toggleFavorite(streamerId, !newStatus),
        },
      });
      console.error("Error updating favorite:", error);
    }
  };

  // Enhanced export function with column selection for Pro users
  const handleExport = async () => {
    const selected = Object.values(selectedStreamers).some(Boolean);
    const exportData = selected
      ? savedStreamers.filter((row) => selectedStreamers[row.id])
      : savedStreamers;

    if (exportData.length === 0) {
      toast.error("There are no saved streamers to export.");
      return;
    }

    // Subscription plan checks
    if (exportFormat === "json" && user?.subscription_plan === "Free") {
      toast.error("JSON export is only available on Basic and Pro plans", {
        description: "Upgrade your subscription to access this feature",
        icon: "🔒",
        closeButton: true,
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

    // Remove User ID column from export data
    const exportSafeData = exportData.map((row) => {
      const { user_id, folder_id, is_favourite, ...rowWithoutUnwanted } =
        row as any;

      const localSavedAt = row.saved_at
        ? new Date(row.saved_at).toLocaleString()
        : "";
      const censoredEmail = row.email_revealed
        ? row.gmail
        : row.gmail
        ? normalizeEmails(row.gmail)
            .map(() => "••••••••")
            .join(", ")
        : "";

      const censoredSocials = row.socials_revealed
        ? {
            twitter: row.twitter,
            youtube: row.youtube,
            instagram: row.instagram,
            discord: row.discord,
            facebook: row.facebook,
          }
        : {
            twitter: row.twitter ? "••••••••" : "",
            youtube: row.youtube ? "••••••••" : "",
            instagram: row.instagram ? "••••••••" : "",
            discord: row.discord ? "••••••••" : "",
            facebook: row.facebook ? "••••••••" : "",
          };

      return {
        ...rowWithoutUnwanted,
        saved_at: localSavedAt,
        gmail: censoredEmail,
        ...censoredSocials,
      };
    });

    console.log(exportSafeData);

    // Export logic
    if (exportFormat === "csv") {
      exportToCSV(
        exportSafeData,
        user?.id,
        "saved-streamers.csv",
        exportColumns
      );
      toast.success(`Exported ${exportSafeData.length} records as CSV`, {
        description: "Your file has been downloaded successfully",
        icon: "📄",
        closeButton: true,
        duration: 4000,
      });
    } else if (exportFormat === "json") {
      exportToJSON(
        exportSafeData,
        user?.id,
        "saved-streamers.json",
        exportColumns
      );
      toast.success(`Exported ${exportSafeData.length} records as JSON`, {
        description: "Your file has been downloaded successfully",
        icon: "📄",
        closeButton: true,
        duration: 4000,
      });
    } else if (exportFormat === "excel") {
      exportToExcel(
        exportSafeData,
        user?.id,
        "saved-streamers.xlsx",
        exportColumns
      );
      toast.success(`Exported ${exportSafeData.length} records as Excel`, {
        description: "Your file has been downloaded successfully",
        icon: "📄",
        closeButton: true,
        duration: 4000,
      });
    }

    setExportOptionsDialogOpen(false);
  };

  const handleRevealSocials = async (streamerId: string) => {
    try {
      const success = await revealSocialLinks(streamerId);
      if (success) {
        toast.success("Social links revealed successfully", {
          description: "You can now access all social media profiles",
          icon: "🔗",
          closeButton: true,
          duration: 3000,
        });
        setSavedStreamers((prev) =>
          prev.map((streamer) =>
            streamer.id === streamerId
              ? { ...streamer, socials_revealed: true }
              : streamer
          )
        );
        setRevealedSocials((prev) => ({
          ...prev,
          [streamerId]: true,
        }));
      } else {
        // Do nothing: insufficient credits toast already shown by revealSocialLinks
        return;
      }
    } catch (error) {
      // Revert optimistic update on error
      setSavedStreamers((prev) =>
        prev.map((streamer) =>
          streamer.id === streamerId
            ? { ...streamer, socials_revealed: false }
            : streamer
        )
      );
      setRevealedSocials((prev) => ({
        ...prev,
        [streamerId]: false,
      }));
      console.log(error);
      toast.error("Failed to reveal social links", {
        description:
          "Please try again or contact support if the issue persists",
        icon: "❌",
        closeButton: true,
        action: {
          label: "Retry",
          onClick: () => handleRevealSocials(streamerId),
        },
      });
      console.error("Error revealing socials:", error);
    }
  };

  const handleRevealEmail = async (streamerId: string) => {
    if (!user) return;

    if (!canAccessFeature("email", user.subscription_plan)) {
      showUpgradeToast("email");
      return;
    }

    try {
      const success = await revealEmail(streamerId);
      if (success) {
        toast.success("Email address revealed successfully", {
          description: "The email address is now visible and accessible",
          icon: "📧",
          closeButton: true,
          duration: 3000,
        });
        setSavedStreamers((prev) =>
          prev.map((streamer) =>
            streamer.id === streamerId
              ? { ...streamer, email_revealed: true }
              : streamer
          )
        );
        setRevealedEmails((prev) => ({
          ...prev,
          [streamerId]: true,
        }));
      } else {
        // Do nothing: insufficient credits toast already shown by revealEmail
        return;
      }
    } catch (error) {
      // Revert optimistic update on error
      setSavedStreamers((prev) =>
        prev.map((streamer) =>
          streamer.id === streamerId
            ? { ...streamer, email_revealed: false }
            : streamer
        )
      );
      setRevealedEmails((prev) => ({
        ...prev,
        [streamerId]: false,
      }));
      console.log(error);
      toast.error("Failed to reveal email address", {
        description:
          "Please try again or contact support if the issue persists",
        icon: "❌",
        closeButton: true,
        action: {
          label: "Retry",
          onClick: () => handleRevealEmail(streamerId),
        },
      });
      console.error("Error revealing email:", error);
    }
  };
  // Bulk reveal socials for selected streamers with confirmation
  const handleBulkRevealSocials = async () => {
    const selectedStreamerIds = Object.entries(selectedStreamers)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);

    if (selectedStreamerIds.length === 0) {
      toast.error("No streamers selected", {
        description:
          "Please select at least one streamer to reveal social links",
        icon: "⚠️",
        closeButton: true,
        duration: 4000,
      });
      return;
    }

    const streamersToReveal = selectedStreamerIds.filter((id) => {
      const streamer = savedStreamers.find((s) => s.id === id);
      return streamer && hasSocialLinks(streamer) && !streamer.socials_revealed;
    });

    if (streamersToReveal.length === 0) {
      toast.info(
        "All selected streamers either have no social links or are already revealed",
        {
          description:
            "Try selecting different streamers or check your selection",
          icon: "ℹ️",
          closeButton: true,
          duration: 5000,
        }
      );
      return;
    }

    setBulkSocialsConfirmOpen(true);
  };

  const confirmBulkRevealSocials = async () => {
    setBulkSocialsConfirmOpen(false);

    const selectedStreamerIds = Object.entries(selectedStreamers)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);

    const streamersToReveal = selectedStreamerIds.filter((id) => {
      const streamer = savedStreamers.find((s) => s.id === id);
      return streamer && hasSocialLinks(streamer) && !streamer.socials_revealed;
    });

    setBulkRevealingSocials(true);
    let successCount = 0;
    let failCount = 0;

    toast.info(
      `Revealing social links for ${streamersToReveal.length} streamers...`,
      {
        description: "This may take a few moments to complete",
        icon: "⏳",
        closeButton: true,
        duration: 6000,
      }
    );

    try {
      for (const streamerId of streamersToReveal) {
        try {
          const success = await revealSocialLinks(streamerId);
          if (success) {
            successCount++;

            setRevealedSocials((prev) => ({
              ...prev,
              [streamerId]: true,
            }));

            setSavedStreamers((prev) =>
              prev.map((streamer) =>
                streamer.id === streamerId
                  ? { ...streamer, socials_revealed: true }
                  : streamer
              )
            );
            // updateCredits(-1);
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully revealed social links for ${successCount} streamers`,
          {
            description: `${successCount} streamers now have accessible social media links`,
            icon: "✅",
            closeButton: true,
            duration: 4000,
          }
        );
      }

      if (failCount > 0) {
        toast.error(
          `Failed to reveal social links for ${failCount} streamers`,
          {
            description:
              "Some operations failed. Please try again for the remaining streamers",
            icon: "⚠️",
            closeButton: true,
            duration: 5000,
          }
        );
      }
    } finally {
      setBulkRevealingSocials(false);
    }
  };

  // Bulk reveal emails for selected streamers with confirmation
  const handleBulkRevealEmails = async () => {
    if (!user) return;

    if (!canAccessFeature("email", user.subscription_plan)) {
      showUpgradeToast("email");
      return;
    }

    const selectedStreamerIds = Object.entries(selectedStreamers)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);

    if (selectedStreamerIds.length === 0) {
      toast.error("No streamers selected", {
        description:
          "Please select at least one streamer to reveal email addresses",
        icon: "⚠️",
        closeButton: true,
        duration: 4000,
      });
      return;
    }

    const streamersToReveal = selectedStreamerIds.filter((id) => {
      const streamer = savedStreamers.find((s) => s.id === id);
      return streamer && hasEmails(streamer) && !streamer.email_revealed;
    });

    if (streamersToReveal.length === 0) {
      toast.info(
        "All selected streamers either have no email addresses or are already revealed",
        {
          description:
            "Try selecting different streamers or check your selection",
          icon: "ℹ️",
          closeButton: true,
          duration: 5000,
        }
      );
      return;
    }

    setBulkEmailsConfirmOpen(true);
  };

  const confirmBulkRevealEmails = async () => {
    setBulkEmailsConfirmOpen(false);

    const selectedStreamerIds = Object.entries(selectedStreamers)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);

    const streamersToReveal = selectedStreamerIds.filter((id) => {
      const streamer = savedStreamers.find((s) => s.id === id);
      return streamer && hasEmails(streamer) && !streamer.email_revealed;
    });

    setBulkRevealingEmails(true);
    let successCount = 0;
    let failCount = 0;

    toast.info(
      `Revealing email addresses for ${streamersToReveal.length} streamers...`,
      {
        description: "This may take a few moments to complete",
        icon: "⏳",
        closeButton: true,
        duration: 6000,
      }
    );

    try {
      for (const streamerId of streamersToReveal) {
        try {
          const success = await revealEmail(streamerId);
          if (success) {
            successCount++;

            setRevealedEmails((prev) => ({
              ...prev,
              [streamerId]: true,
            }));

            setSavedStreamers((prev) =>
              prev.map((streamer) =>
                streamer.id === streamerId
                  ? { ...streamer, email_revealed: true }
                  : streamer
              )
            );
            // updateCredits(-2);
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully revealed email addresses for ${successCount} streamers`,
          {
            description: `${successCount} streamers now have accessible email addresses`,
            icon: "✅",
            closeButton: true,
            duration: 4000,
          }
        );
      }

      if (failCount > 0) {
        toast.error(
          `Failed to reveal email addresses for ${failCount} streamers`,
          {
            description:
              "Some operations failed. Please try again for the remaining streamers",
            icon: "⚠️",
            closeButton: true,
            duration: 5000,
          }
        );
      }
    } finally {
      setBulkRevealingEmails(false);
    }
  };

  const handleBulkMoveToFolder = async (
    streamerIds: string[],
    targetFolderId: string
  ) => {
    const leavingCount: Record<string, number> = {};
    let addedCount = 0;

    savedStreamers.forEach((s) => {
      if (streamerIds.includes(s.id)) {
        if (s.folder_id && s.folder_id !== targetFolderId) {
          leavingCount[s.folder_id] = (leavingCount[s.folder_id] || 0) + 1;
        }
        if (targetFolderId && s.folder_id !== targetFolderId) {
          addedCount += 1;
        }
      }
    });

    setSavedStreamers((prev) =>
      prev.map((s) =>
        streamerIds.includes(s.id) ? { ...s, folder_id: targetFolderId } : s
      )
    );

    const updatedFolders = folders.map((folder) => {
      let count = folder.streamer_count || 0;

      if (leavingCount[folder.id]) {
        count = Math.max(count - leavingCount[folder.id], 0);
      }

      if (folder.id === targetFolderId) {
        count += addedCount;
      }

      return { ...folder, streamer_count: count };
    });

    setFolders(updatedFolders);

    for (const id of streamerIds) {
      await handleMoveToFolder(id, targetFolderId);
    }
  };

  const toggleExpandEmails = (streamerId: string) => {
    setExpandedEmails((prev) => ({
      ...prev,
      [streamerId]: !prev[streamerId],
    }));
  };

  function normalizeEmails(gmail: any): string[] {
    if (!gmail) return [];
    if (Array.isArray(gmail)) return gmail.filter(Boolean);
    if (typeof gmail === "string") {
      // Handle stringified array: '["email@x.com"]'
      try {
        const parsed = JSON.parse(gmail);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        // Not a JSON array, treat as CSV
        if (gmail.trim() === "") return [];
        return gmail
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
      }
    }
    return [];
  }

  function hasEmails(streamer: TwitchData): boolean {
    const emails = normalizeEmails(streamer.gmail);
    return emails.length > 0;
  }

  function hasSocialLinks(streamer: TwitchData): boolean {
    return getSocialLinksArray(streamer).length > 0;
  }

  function normalizeSocialLinks(data: string | string[] | undefined): string[] {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter(Boolean);
    if (typeof data === "string") {
      // Handle stringified array: '["url"]'
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        // Not a JSON array, treat as CSV or single URL
        if (data.trim() === "") return [];
        // If it's a CSV
        if (data.includes(",")) {
          return data
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);
        }
        // Otherwise, treat as single URL
        return [data.trim()];
      }
    }
    return [];
  }
  const getSocialLinksArray = (streamer: TwitchData) => {
    const links: {
      type: string;
      url: string;
      icon: React.ComponentType<any>;
    }[] = [];

    const addLinks = (
      type: string,
      data: string | string[] | undefined,
      Icon: React.ComponentType<any>
    ) => {
      const urls = normalizeSocialLinks(data);
      urls.forEach((url) => {
        // Only add if it's a valid http(s) link
        if (url && /^https?:\/\//.test(url)) {
          links.push({ type, url, icon: Icon });
        }
      });
    };

    addLinks("discord", streamer.discord, DiscordLogo);
    addLinks("youtube", streamer.youtube, YoutubeLogo);
    addLinks("twitter", streamer.twitter, TwitterLogo);
    addLinks("facebook", streamer.facebook, FacebookLogo);
    addLinks("instagram", streamer.instagram, InstagramLogo);

    return links;
  };

  const handleMoveToFolder = async (
    streamerId: string,
    folderId: string | null
  ) => {
    const originalStreamer = savedStreamers.find((s) => s.id === streamerId);
    const originalFolderId = originalStreamer?.folder_id;

    setSavedStreamers((prev) =>
      prev.map((s) =>
        s.id === streamerId
          ? { ...s, folder_id: folderId === null ? undefined : folderId }
          : s
      )
    );
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (user?.id) {
      headers["x-user-id"] = user.id;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/move`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            streamer_id: streamerId,
            folder_id: folderId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to move streamer");
      }

      const folderName =
        folders.find((f) => f.id === folderId)?.name || "Default";
      toast.success(`Moved to ${folderName}`, {
        description:
          "Streamer has been successfully moved to the selected folder",
        icon: "📁",
        closeButton: true,
        duration: 3000,
      });
    } catch (error) {
      setSavedStreamers((prev) =>
        prev.map((s) =>
          s.id === streamerId ? { ...s, folder_id: originalFolderId } : s
        )
      );

      toast.error("Failed to move streamer", {
        description: "Please try again or check your connection",
        icon: "❌",
        closeButton: true,
        action: {
          label: "Retry",
          onClick: () => handleMoveToFolder(streamerId, folderId),
        },
      });
      console.error("Error moving streamer:", error);
    }
  };

  const handleDeleteStreamer = async (streamerId: string) => {
    const streamerToDelete = savedStreamers.find((s) => s.id === streamerId);

    setSavedStreamers((prev) => prev.filter((s) => s.id !== streamerId));

    setSelectedStreamers((prev) => {
      const updated = { ...prev };
      delete updated[streamerId];
      return updated;
    });

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        headers["x-user-id"] = user.id;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/${streamerId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete streamer");
      }

      toast.success("Streamer removed from saved list", {
        description:
          "The streamer has been permanently removed from your collection",
        icon: "🗑️",
        closeButton: true,
        duration: 3000,
      });
    } catch (error) {
      if (streamerToDelete) {
        setSavedStreamers((prev) =>
          [...prev, streamerToDelete].sort((a, b) => {
            if (a.is_favourite && !b.is_favourite) return -1;
            if (!a.is_favourite && b.is_favourite) return 1;
            return 0;
          })
        );
      }

      toast.error("Failed to delete streamer", {
        description: "Please try again or check your connection",
        icon: "❌",
        closeButton: true,
        action: {
          label: "Retry",
          onClick: () => handleDeleteStreamer(streamerId),
        },
      });
      console.error("Error deleting streamer:", error);
    }
  };

  // Apply sorting and pagination
  const sortedData = sortData(savedStreamers);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Get selected streamers count and stats
  const selectedCount = Object.values(selectedStreamers).filter(Boolean).length;
  const selectedStreamerData = savedStreamers.filter(
    (streamer) => selectedStreamers[streamer.id]
  );
  const selectedWithSocials = selectedStreamerData.filter(
    (s) => hasSocialLinks(s) && !s.socials_revealed
  ).length;
  const selectedWithEmails = selectedStreamerData.filter(
    (s) => hasEmails(s) && !s.email_revealed
  ).length;

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

  console.log(savedStreamers);

  return (
    <TooltipProvider>
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
                  savedStreamers.length > 0 &&
                  savedStreamers.every((s) => selectedStreamers[s.id])
                }
                onCheckedChange={(checked) =>
                  handleSelectAllGlobalChange(checked === true)
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
              {selectedCount} selected
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Enhanced Column Toggle Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 bg-transparent"
                >
                  <Filter className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {Object.entries(visibleColumns).map(([column, isVisible]) => (
                  <DropdownMenuItem
                    key={column}
                    onClick={() =>
                      setVisibleColumns((prev) => ({
                        ...prev,
                        [column]: !prev[column as keyof typeof prev],
                      }))
                    }
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox checked={isVisible} />
                    <span className="capitalize">
                      {column === "viewers" ? "Viewers" : column}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced Export Dropdown */}
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
                  <span className="inline sm:hidden">Export</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
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
                    Basic
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    if (user?.subscription_plan !== "Pro") {
                      toast.error(
                        "Excel export is only available on Pro plans",
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
                {/* Pro-only column selection */}
                <DropdownMenuItem
                  onClick={() => {
                    if (user?.subscription_plan !== "Pro") {
                      toast.error(
                        "Column selection is only available on Pro plans",
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
                    setExportColumns({ ...visibleColumns });
                    setExportOptionsDialogOpen(true);
                  }}
                  className={`flex items-center gap-2 ${
                    user?.subscription_plan !== "Pro"
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Column Options</span>
                  {user?.subscription_plan !== "Pro" && (
                    <Badge className="ml-auto bg-purple-100 text-purple-800 hover:bg-purple-100">
                      Pro
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleExport}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Now</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Action Buttons with Confirmation Dialogs */}
            {selectedCount > 0 && (
              <>
                {selectedWithSocials > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 bg-transparent"
                        onClick={handleBulkRevealSocials}
                        disabled={bulkRevealingSocials}
                      >
                        {bulkRevealingSocials ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 sm:mr-2 animate-spin" />
                        ) : (
                          <Share2 className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                        )}
                        <span className="hidden sm:inline">
                          {bulkRevealingSocials
                            ? "Revealing..."
                            : `Reveal Socials (${selectedWithSocials})`}
                        </span>
                        <span className="inline sm:hidden">
                          {bulkRevealingSocials
                            ? "..."
                            : `Socials (${selectedWithSocials})`}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Reveal social media links for {selectedWithSocials}{" "}
                      selected streamers
                    </TooltipContent>
                  </Tooltip>
                )}

                {selectedWithEmails > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 transition-all duration-200 ${
                          canAccessFeature("email", user?.subscription_plan)
                            ? "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                            : "border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300"
                        }`}
                        onClick={handleBulkRevealEmails}
                        disabled={bulkRevealingEmails}
                      >
                        {bulkRevealingEmails ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 sm:mr-2 animate-spin" />
                        ) : (
                          <Mail className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                        )}
                        <span className="hidden sm:inline">
                          {bulkRevealingEmails
                            ? "Revealing..."
                            : `Reveal Emails (${selectedWithEmails})`}
                        </span>
                        <span className="inline sm:hidden">
                          {bulkRevealingEmails
                            ? "..."
                            : `Emails (${selectedWithEmails})`}
                        </span>
                        {!canAccessFeature(
                          "email",
                          user?.subscription_plan
                        ) && (
                          <Badge className="ml-1 bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs px-1">
                            Basic
                          </Badge>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {canAccessFeature("email", user?.subscription_plan)
                        ? `Reveal email addresses for ${selectedWithEmails} selected streamers`
                        : "Upgrade to Basic to reveal email addresses"}
                    </TooltipContent>
                  </Tooltip>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 bg-transparent"
                    >
                      <FolderClosed className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Move to folder</span>
                      <span className="inline sm:hidden">Move</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="flex justify-between items-center">
                      Move to folder
                    </DropdownMenuLabel>
                    <div className="max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {folders
                        .filter(
                          (folder) =>
                            folder.id !== "all" && folder.id !== "favourites"
                        )
                        .map((folder) => (
                          <DropdownMenuItem
                            key={folder.id}
                            onClick={async () => {
                              const selectedIds = Object.entries(
                                selectedStreamers
                              )
                                .filter(([_, selected]) => selected)
                                .map(([id]) => id);

                              await handleBulkMoveToFolder(
                                selectedIds,
                                folder.id
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
                  className="h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-3 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  onClick={async () => {
                    const selectedIds = Object.entries(selectedStreamers)
                      .filter(([_, selected]) => selected)
                      .map(([id]) => id);

                    for (const id of selectedIds) {
                      await handleDeleteStreamer(id);
                    }

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
                      currentItems.every((s) => selectedStreamers[s.id])
                    }
                    onCheckedChange={(checked) =>
                      handleSelectAllPageChange(checked === true)
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
                {visibleColumns.email && (
                  <TableHead
                    className={`cursor-pointer ${
                      !canAccessFeature("email", user?.subscription_plan)
                        ? "opacity-60"
                        : ""
                    }`}
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      Email
                      {!canAccessFeature("email", user?.subscription_plan) && (
                        <Badge className="ml-1 bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs px-1">
                          Basic
                        </Badge>
                      )}
                      <div className="ml-1">
                        {sortColumn === "email" ? (
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
                {visibleColumns.folder && <TableHead>Folder</TableHead>}
                {visibleColumns.date && (
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("saved")}
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
                          <Tooltip>
                            <TooltipTrigger asChild>
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
                            </TooltipTrigger>
                            <TooltipContent>
                              {row.is_favourite
                                ? "Remove from favorites"
                                : "Add to favorites"}
                            </TooltipContent>
                          </Tooltip>
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
                            <span className="text-center">{row.game_name}</span>
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.social && (
                        <TableCell className="py-2 sm:py-3">
                          {(() => {
                            const allSocialLinks = getSocialLinksArray(row);
                            if (allSocialLinks.length === 0) {
                              return (
                                <span className="text-gray-400 text-xs">
                                  No socials found
                                </span>
                              );
                            }

                            // Check if socials need to be revealed
                            if (!row.socials_revealed) {
                              return (
                                <div className="flex items-center">
                                  <div className="flex gap-1">
                                    {/* Show blurred placeholder icons */}
                                    {allSocialLinks
                                      .slice(0, 3)
                                      .map((social, idx) => (
                                        <div
                                          key={`placeholder-${idx}`}
                                          className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-400 blur-sm"
                                        >
                                          <social.icon className="h-4 w-4" />
                                        </div>
                                      ))}
                                    {allSocialLinks.length > 3 && (
                                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-400 text-xs blur-sm">
                                        +{allSocialLinks.length - 3}
                                      </div>
                                    )}
                                  </div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 rounded-full text-xs px-3 py-0 ml-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition-all duration-200 shadow-sm bg-transparent"
                                        onClick={() =>
                                          handleRevealSocials(row.id)
                                        }
                                      >
                                        <Unlock className="h-3 w-3 mr-1.5" />
                                        Reveal
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Reveal social media links
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              );
                            }

                            // Group links by platform type
                            const groupedLinks = allSocialLinks.reduce(
                              (acc, link) => {
                                if (!acc[link.type]) {
                                  acc[link.type] = [];
                                }
                                acc[link.type].push(link);
                                return acc;
                              },
                              {} as Record<string, typeof allSocialLinks>
                            );

                            return (
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(groupedLinks).map(
                                  ([platform, links]) => {
                                    const IconComponent = links[0].icon;
                                    const hasMultiple = links.length > 1;

                                    return (
                                      <Tooltip key={platform}>
                                        <TooltipTrigger asChild>
                                          <div className="relative">
                                            <motion.div
                                              className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 cursor-pointer"
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => {
                                                if (links.length === 1) {
                                                  window.open(
                                                    links[0].url,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                  );
                                                }
                                              }}
                                            >
                                              <IconComponent className="h-4 w-4" />
                                            </motion.div>
                                            {hasMultiple && (
                                              <motion.div
                                                className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                  delay: 0.1,
                                                  type: "spring",
                                                  stiffness: 500,
                                                }}
                                              >
                                                {links.length}
                                              </motion.div>
                                            )}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="top"
                                          className="max-w-xs"
                                        >
                                          <div className="space-y-1">
                                            <div className="font-medium text-sm capitalize mb-2">
                                              {platform}{" "}
                                              {hasMultiple
                                                ? `(${links.length} links)`
                                                : ""}
                                            </div>
                                            {links.map((link, idx) => (
                                              <motion.a
                                                key={`${platform}-${idx}`}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-150 block"
                                                whileHover={{ x: 2 }}
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                              >
                                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate max-w-[200px]">
                                                  {link.url}
                                                  {/* {hasMultiple
                                                    ? `Link ${idx + 1}`
                                                    : "Open link"} */}
                                                </span>
                                              </motion.a>
                                            ))}
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  }
                                )}
                              </div>
                            );
                          })()}
                        </TableCell>
                      )}
                      {visibleColumns.email && (
                        <TableCell className="py-2 sm:py-3 max-w-[200px]">
                          {(() => {
                            const emails = normalizeEmails(row.gmail);
                            console.log(emails);
                            if (emails.length === 0) {
                              return (
                                <span className="text-gray-400 text-xs">
                                  No email available
                                </span>
                              );
                            }
                            if (!row.email_revealed) {
                              return (
                                <div className="flex items-center">
                                  <span className="text-gray-400 text-xs blur-sm select-none truncate max-w-[120px]">
                                    {"••••••••"}
                                  </span>
                                  {canAccessFeature(
                                    "email",
                                    user?.subscription_plan
                                  ) ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 rounded-full text-xs px-3 py-0 ml-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 transition-all duration-200 shadow-sm bg-transparent"
                                          onClick={() =>
                                            handleRevealEmail(row.id)
                                          }
                                        >
                                          <Unlock className="h-3 w-3 mr-1.5" />
                                          Reveal
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Reveal email address
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 rounded-full text-xs px-3 py-0 ml-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 transition-all duration-200 shadow-sm bg-transparent"
                                          onClick={() =>
                                            showUpgradeToast("email")
                                          }
                                        >
                                          <Unlock className="h-3 w-3 mr-1.5" />
                                          <span className="mr-1">Reveal</span>
                                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs px-1">
                                            Basic
                                          </Badge>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Upgrade to Basic to reveal emails
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              );
                            }
                            // If revealed
                            if (emails.length === 1) {
                              return (
                                <div className="flex items-center">
                                  <a
                                    href={`mailto:${emails[0]}`}
                                    className="text-blue-600 hover:underline flex items-center truncate group"
                                  >
                                    <EnvelopeSimple className="h-4 w-4 mr-1 flex-shrink-0 group-hover:text-blue-700" />
                                    <span className="text-xs truncate">
                                      {emails[0]}
                                    </span>
                                  </a>
                                </div>
                              );
                            }
                            // If multiple emails
                            return (
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <a
                                    href={`mailto:${emails[0]}`}
                                    className="text-blue-600 hover:underline flex items-center truncate group"
                                  >
                                    <EnvelopeSimple className="h-4 w-4 mr-1 flex-shrink-0 group-hover:text-blue-700" />
                                    <span className="text-xs truncate">
                                      {emails[0]}
                                    </span>
                                  </a>
                                </div>
                                <div className="mt-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 py-0 text-xs text-gray-500 hover:text-gray-700 flex items-center"
                                    onClick={() => toggleExpandEmails(row.id)}
                                  >
                                    {expandedEmails[row.id] ? (
                                      <>
                                        <ChevronUp className="h-3 w-3 mr-1" />
                                        Hide {emails.length - 1} more
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="h-3 w-3 mr-1" />
                                        Show {emails.length - 1} more
                                      </>
                                    )}
                                  </Button>
                                  {expandedEmails[row.id] && (
                                    <div className="mt-1 space-y-1 pl-1 border-l-2 border-gray-100">
                                      {emails.slice(1).map((email, idx) => (
                                        <a
                                          key={idx}
                                          href={`mailto:${email}`}
                                          className="text-blue-600 hover:underline flex items-center truncate group text-xs"
                                        >
                                          <EnvelopeSimple className="h-3 w-3 mr-1 flex-shrink-0 group-hover:text-blue-700" />
                                          <span className="truncate">
                                            {email}
                                          </span>
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </TableCell>
                      )}
                      {visibleColumns.folder && (
                        <TableCell className="py-2 sm:py-3">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {row.folder_id
                              ? folders.find((f) => f.id === row.folder_id)
                                  ?.name
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

                            {hasSocialLinks(row) &&
                              !revealedSocials[row.id] && (
                                <DropdownMenuItem
                                  onClick={() => handleRevealSocials(row.id)}
                                  className="cursor-pointer"
                                >
                                  <Share2 className="mr-2 h-4 w-4" />
                                  <span>Reveal Social Links</span>
                                </DropdownMenuItem>
                              )}

                            {hasEmails(row) && !revealedEmails[row.id] && (
                              <DropdownMenuItem
                                onClick={() => {
                                  if (
                                    !canAccessFeature(
                                      "email",
                                      user?.subscription_plan
                                    )
                                  ) {
                                    showUpgradeToast("email");
                                    return;
                                  }
                                  handleRevealEmail(row.id);
                                }}
                                className="cursor-pointer"
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Reveal Email</span>
                                {!canAccessFeature(
                                  "email",
                                  user?.subscription_plan
                                ) && (
                                  <Badge className="ml-auto bg-blue-100 text-blue-800">
                                    Basic
                                  </Badge>
                                )}
                              </DropdownMenuItem>
                            )}

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
                                .map((folder) => (
                                  <DropdownMenuItem
                                    key={folder.id}
                                    onClick={async () =>
                                      await handleMoveToFolder(
                                        row.id,
                                        folder.id
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    <FolderClosed className="mr-2 h-4 w-4" />
                                    <span>{folder.name}</span>
                                  </DropdownMenuItem>
                                ))}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={async () =>
                                await handleDeleteStreamer(row.id)
                              }
                              className="cursor-pointer"
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

        <div className="flex items-center justify-end space-x-2 py-2 px-4">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
                aria-disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage !== page) handlePageChange(page);
                      }}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={
                        currentPage === page ? "bg-blue-100 text-blue-700" : ""
                      }
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                aria-disabled={currentPage === totalPages}
              />
            </PaginationContent>
          </Pagination>
        </div>
      </motion.div>

      {/* Fixed Context Menu */}
      <AnimatePresence>
        {contextMenu.visible && contextMenu.row && (
          <motion.div
            ref={contextMenuRef}
            className="fixed z-50 bg-white border rounded-md shadow-lg overflow-hidden"
            style={{
              top: menuPosition.y,
              left: menuPosition.x,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <div className="w-[220px] p-1">
              <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                Actions
              </div>
              <div className="h-px bg-gray-200 my-1" />

              <button
                onClick={() => {
                  if (contextMenu.row) {
                    toggleFavorite(
                      contextMenu.row.id,
                      contextMenu.row.is_favourite
                    );
                    setContextMenu((prev) => ({ ...prev, visible: false }));
                  }
                }}
                className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer"
              >
                {contextMenu.row?.is_favourite ? (
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
              </button>

              {contextMenu.row &&
                hasSocialLinks(contextMenu.row) &&
                !revealedSocials[contextMenu.row.id] && (
                  <button
                    onClick={() => {
                      if (contextMenu.row) {
                        handleRevealSocials(contextMenu.row.id);
                        setContextMenu((prev) => ({ ...prev, visible: false }));
                      }
                    }}
                    className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Reveal Social Links</span>
                  </button>
                )}

              {contextMenu.row &&
                contextMenu.row.gmail &&
                !revealedEmails[contextMenu.row.id] && (
                  <button
                    onClick={() => {
                      if (!canAccessFeature("email", user?.subscription_plan)) {
                        showUpgradeToast("email");
                        return;
                      }
                      if (contextMenu.row) {
                        handleRevealEmail(contextMenu.row.id);
                        setContextMenu((prev) => ({ ...prev, visible: false }));
                      }
                    }}
                    className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Reveal Email</span>
                    {!canAccessFeature("email", user?.subscription_plan) && (
                      <Badge className="ml-auto bg-blue-100 text-blue-800 text-xs">
                        Basic
                      </Badge>
                    )}
                  </button>
                )}

              <div className="h-px bg-gray-200 my-1" />
              <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                Move to folder
              </div>
              <div className="max-h-[150px] overflow-y-auto">
                {folders
                  .filter(
                    (folder) =>
                      folder.id !== "all" && folder.id !== "favourites"
                  )
                  .map((folder) => (
                    <button
                      key={folder.id}
                      onClick={async () => {
                        if (contextMenu.row) {
                          await handleMoveToFolder(
                            contextMenu.row.id,
                            folder.id
                          );
                          setContextMenu((prev) => ({
                            ...prev,
                            visible: false,
                          }));
                        }
                      }}
                      className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer"
                    >
                      <FolderClosed className="mr-2 h-4 w-4" />
                      <span>{folder.name}</span>
                    </button>
                  ))}
              </div>
              <div className="h-px bg-gray-200 my-1" />
              <button
                onClick={async () => {
                  if (contextMenu.row) {
                    await handleDeleteStreamer(contextMenu.row.id);
                    setContextMenu((prev) => ({ ...prev, visible: false }));
                  }
                }}
                className="w-full flex items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-sm cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Reveal Socials Confirmation Dialog */}
      <AlertDialog
        open={bulkSocialsConfirmOpen}
        onOpenChange={setBulkSocialsConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Bulk Social Links Reveal
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reveal social media links for{" "}
              <strong>
                {
                  Object.entries(selectedStreamers)
                    .filter(([_, selected]) => selected)
                    .filter(([id]) => {
                      const streamer = savedStreamers.find((s) => s.id === id);
                      return (
                        streamer &&
                        hasSocialLinks(streamer) &&
                        !streamer.socials_revealed
                      );
                    }).length
                }
              </strong>{" "}
              streamers. This action will consume{" "}
              <strong>
                {
                  Object.entries(selectedStreamers)
                    .filter(([_, selected]) => selected)
                    .filter(([id]) => {
                      const streamer = savedStreamers.find((s) => s.id === id);
                      return (
                        streamer &&
                        hasSocialLinks(streamer) &&
                        !streamer.socials_revealed
                      );
                    }).length
                }
              </strong>{" "}
              credits and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkRevealSocials}>
              Confirm & Reveal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Bulk Reveal Emails Confirmation Dialog */}

      <AlertDialog
        open={bulkEmailsConfirmOpen}
        onOpenChange={setBulkEmailsConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Bulk Email Reveal
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reveal email addresses for{" "}
              <strong>
                {
                  Object.entries(selectedStreamers)
                    .filter(([_, selected]) => selected)
                    .filter(([id]) => {
                      const streamer = savedStreamers.find((s) => s.id === id);
                      return (
                        streamer &&
                        hasEmails(streamer) &&
                        !streamer.email_revealed
                      );
                    }).length
                }
              </strong>{" "}
              streamers. This action will consume{" "}
              <strong>
                {Object.entries(selectedStreamers)
                  .filter(([_, selected]) => selected)
                  .filter(([id]) => {
                    const streamer = savedStreamers.find((s) => s.id === id);
                    return (
                      streamer &&
                      hasEmails(streamer) &&
                      !streamer.email_revealed
                    );
                  }).length * 2}
              </strong>{" "}
              credits (2 credits per email) and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkRevealEmails}>
              Confirm & Reveal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
