"use client";

import { Badge } from "@/components/ui/badge";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bookmark,
  Trash2,
  RefreshCw,
  FolderX,
  Plus,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SavedStreamersTable from "../saved-streamers-table";
import type { Folder, TwitchData } from "../types";
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
import { useUser } from "@/app/context/UserContext";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

type SavedStreamersTabProps = {};

export default function SavedStreamersTab({}: SavedStreamersTabProps) {
  const [savedStreamers, setSavedStreamers] = useState<TwitchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!user) return;
    fetchData(user.id, "all");
  }, [user]);

  const fetchData = async (userId: string | undefined, folderId = "all") => {
    try {
      setIsLoading(true);

      // Fetch all streamers once for counts
      const allStreamersRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/all?user_id=${userId}`
      );
      const allStreamers = await allStreamersRes.json();
      const validAllStreamers = Array.isArray(allStreamers) ? allStreamers : [];

      // Fetch streamers for the selected folder (filtered data)
      const selectedStreamersRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/${folderId}?user_id=${userId}`
      );
      const selectedStreamers = await selectedStreamersRes.json();
      const validSelectedStreamers = Array.isArray(selectedStreamers)
        ? selectedStreamers
        : [];

      // Sort selected streamers so favorites come first
      const sortedStreamers = validSelectedStreamers.sort((a, b) => {
        if (a.is_favourite && !b.is_favourite) return -1;
        if (!a.is_favourite && b.is_favourite) return 1;
        return 0;
      });

      // Fetch folders
      const foldersRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}folders?user_id=${userId}`
      );
      const fetchedFolders = await foldersRes.json();

      const filteredFolders = fetchedFolders.filter(
        (folder: Folder) =>
          folder.name !== "All" && folder.name !== "Favourites"
      );

      const specialFolders: Folder[] = [
        {
          id: "all",
          name: "All",
          user_id: userId ?? "",
          is_mandatory: true,
          created_at: new Date().toISOString(),
          streamer_count: validAllStreamers.length,
        },
        {
          id: "favourites",
          name: "Favourites",
          user_id: userId ?? "",
          is_mandatory: true,
          created_at: new Date().toISOString(),
          streamer_count: validAllStreamers.filter(
            (s: TwitchData) => s.is_favourite
          ).length,
        },
      ];

      setFolders([...specialFolders, ...filteredFolders]);
      setSavedStreamers(sortedStreamers); // <-- Use sorted here
    } catch (err) {
      console.error("Error fetching data:", err);
      toast({
        title: "Error",
        description: "Failed to fetch saved data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (folders.length > 0 && selectedFolder === null) {
      // Find the "all" folder in the loaded folders
      const allFolder = folders.find((f) => f.id === "all") ?? null;
      setSelectedFolder(allFolder);
    }
  }, [folders, selectedFolder]);
  // Filter streamers based on search query and selected folder
  const filteredStreamers = savedStreamers.filter((streamer) => {
    const matchesSearch = streamer.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder
      ? streamer.folder_id === selectedFolder.id
      : true;
    return matchesSearch && matchesFolder;
  });
  const handleDeleteStreamer = async (id: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        headers["x-user-id"] = user.id;
      }
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}saved-streamers/${id}`,
        {
          method: "DELETE",
          headers,
        }
      );
      setSavedStreamers((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Deleted",
        description: "Streamer removed from saved list.",
      });
      fetchData(user?.id, "all");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete streamer",
        variant: "destructive",
      });
    }
  };
  const handleMoveToFolder = async (
    streamerId: string,
    folderId: string | null
  ) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (user?.id) {
      headers["x-user-id"] = user.id;
    }
    try {
      console.log("Sending move request:", {
        streamer_id: streamerId,
        folder_id: folderId,
      });
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/move`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          streamer_id: streamerId,
          folder_id: folderId,
        }),
      });
      setSavedStreamers((prev) =>
        prev.map((s) =>
          s.id === streamerId
            ? { ...s, folder_id: folderId === null ? undefined : folderId }
            : s
        )
      );
      fetchData(user?.id, selectedFolder?.id);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to move streamer",
        variant: "destructive",
      });
    }
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        headers["x-user-id"] = user.id;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}folders/create`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ name: newFolderName }),
        }
      );
      const newFolder = await res.json();
      setFolders((prev) => [...prev, newFolder]);
      setNewFolderName("");
      setIsAddFolderDialogOpen(false);
      toast({ title: "Folder Created" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        headers["x-user-id"] = user.id;
      }
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}folders/${folderId}`, {
        method: "DELETE",
        headers,
      });
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      setSavedStreamers((prev) =>
        prev.map((s) =>
          s.folder_id === folderId ? { ...s, folder_id: undefined } : s
        )
      );
      toast({ title: "Folder deleted" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      });
    }
  };

  const handleFolderClick = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      setSelectedFolder(folder);
      fetchData(user?.id, folder.id);
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Folders
            </Button>
          )}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search saved streamers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr] flex-col md:flex-row">
        {/* FOLDER SIDEBAR */}
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            className={`space-y-4 overflow-x-auto ${
              isMobile ? "fixed inset-0 bg-white z-50 p-4 pt-16" : ""
            }`}
            initial="hidden"
            animate="visible"
            variants={slideIn}
          >
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setIsSidebarOpen(false)}
              >
                ✕
              </Button>
            )}
            <div className="flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-sm font-medium">Folders</h3>
              <Dialog
                open={isAddFolderDialogOpen}
                onOpenChange={setIsAddFolderDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                  >
                    <span className="sr-only">Add folder</span>
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>
                      Organize your saved streamers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="folder-name">Folder Name</Label>
                    <Input
                      id="folder-name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="e.g. Pros, Fitness, VTubers"
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddFolderDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddFolder}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
              {folders.map((folder) => {
                const count = folder.streamer_count ?? 0;
                const isActive = selectedFolder?.id === folder.id;
                return (
                  <div key={folder.id} className="flex items-center group">
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleFolderClick(folder.id)}
                    >
                      <Bookmark
                        className={`mr-2 h-4 w-4 ${
                          isActive ? "text-blue-600" : ""
                        }`}
                      />
                      <span className="truncate">{folder.name}</span>
                      <Badge
                        variant="outline"
                        className={`ml-auto ${
                          isActive
                            ? "bg-blue-200 border-blue-300"
                            : "bg-gray-100"
                        }`}
                      >
                        {count}
                      </Badge>
                    </Button>

                    {/* Only show delete button if it's not a special folder */}
                    {!folder.is_mandatory && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* MAIN PANEL */}
        <motion.div
          className="space-y-4 w-full overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {isLoading ? (
            <Card className="border border-blue-100 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500">Loading saved streamers...</p>
              </CardContent>
            </Card>
          ) : savedStreamers.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-full inline-block align-middle">
                <SavedStreamersTable
                  data={savedStreamers}
                  folders={folders}
                  onDelete={handleDeleteStreamer}
                  onMoveToFolder={handleMoveToFolder}
                  refreshStreamers={() =>
                    fetchData(user?.id, selectedFolder?.id)
                  }
                />
              </div>
            </div>
          ) : (
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FolderX className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No saved streamers found
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  {searchQuery
                    ? "No streamers match your search criteria."
                    : selectedFolder
                    ? "This folder is empty."
                    : "You haven't saved any streamers yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
