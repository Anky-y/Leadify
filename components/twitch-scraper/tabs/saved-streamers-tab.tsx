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
  Folder as FolderIcon,
} from "lucide-react";
import { toast } from "sonner";
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
  const { user } = useUser();

  const isMobile = useMediaQuery("(max-width: 1024px)");

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

      const allStreamersRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/all?user_id=${userId}`
      );
      const allStreamers = await allStreamersRes.json();
      const validAllStreamers = Array.isArray(allStreamers) ? allStreamers : [];

      const selectedStreamersRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}streamers/${folderId}?user_id=${userId}`
      );
      const selectedStreamers = await selectedStreamersRes.json();
      const validSelectedStreamers = Array.isArray(selectedStreamers)
        ? selectedStreamers
        : [];

      const sortedStreamers = validSelectedStreamers.sort((a, b) => {
        if (a.is_favourite && !b.is_favourite) return -1;
        if (!a.is_favourite && b.is_favourite) return 1;
        return 0;
      });

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
      console.log(folders);
      setSavedStreamers(sortedStreamers);
      console.log(savedStreamers);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch saved data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (folders.length > 0 && selectedFolder === null) {
      console.log(folders);
      const allFolder = folders.find((f) => f.id === "all") ?? null;
      console.log(allFolder);
      setSelectedFolder(allFolder);
    }
  }, [folders, selectedFolder]);

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
      toast.success("Streamer removed from saved list.");
      fetchData(user?.id, "all");
    } catch (err) {
      toast.error("Failed to delete streamer");
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
      toast.error("Failed to move streamer");
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
      toast.success("Folder Created");
    } catch (err) {
      toast.error("Failed to create folder");
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
      toast.success("Folder deleted");
    } catch (err) {
      toast.error("Failed to delete folder");
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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full max-w-none">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-4 flex-1">
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Folders
            </Button>
          )}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
            <Input
              type="search"
              placeholder="Search saved streamers..."
              className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        className={`grid gap-6 ${
          isSidebarOpen && !isMobile ? "grid-cols-[280px_1fr]" : "grid-cols-1"
        } transition-all duration-300`}
      >
        {/* Sidebar */}
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            className={`${
              isMobile ? "fixed inset-0 bg-white z-50 p-6 pt-20" : "h-fit"
            }`}
            initial="hidden"
            animate="visible"
            variants={slideIn}
          >
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-6 right-6"
                onClick={() => setIsSidebarOpen(false)}
              >
                ✕
              </Button>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
                  <FolderIcon className="h-5 w-5 text-blue-500" />
                  Folders
                </h3>
                <Dialog
                  open={isAddFolderDialogOpen}
                  onOpenChange={setIsAddFolderDialogOpen}
                >
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-50 rounded-full border border-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-200"
                      >
                        <span className="sr-only">Add folder</span>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="border-blue-100">
                    <DialogHeader>
                      <DialogTitle className="text-blue-800">
                        Create New Folder
                      </DialogTitle>
                      <DialogDescription>
                        Organize your saved streamers into custom folders.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="folder-name" className="text-blue-700">
                        Folder Name
                      </Label>
                      <Input
                        id="folder-name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="e.g. Gaming Pros, VTubers, Content Creators"
                        className="mt-2 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddFolderDialogOpen(false)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddFolder}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Create Folder
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {folders.map((folder) => {
                  const count = folder.streamer_count ?? 0;
                  const isActive = selectedFolder?.id === folder.id;
                  return (
                    <div key={folder.id} className="flex items-center group">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={`w-full justify-start text-sm transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-slate-50 to-gray-50 text-blue-700 hover:from-slate-100 hover:to-gray-100 border border-blue-200 shadow-sm"
                              : "hover:bg-blue-50 hover:text-blue-700"
                          }`}
                          onClick={() => handleFolderClick(folder.id)}
                        >
                          <Bookmark
                            className={`mr-3 h-4 w-4 ${
                              isActive ? "text-blue-600" : "text-gray-500"
                            }`}
                          />
                          <span className="truncate font-medium">
                            {folder.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={`ml-auto ${
                              isActive
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {count}
                          </Badge>
                        </Button>
                      </motion.div>

                      {!folder.is_mandatory && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 ml-1"
                            onClick={() => handleDeleteFolder(folder.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          className="min-w-0 flex-1"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {isLoading ? (
            <Card className="border-2 border-slate-200 shadow-lg bg-gradient-to-br from-white/90 to-slate-50/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="mb-4"
                >
                  <RefreshCw className="h-10 w-10 text-blue-500" />
                </motion.div>
                <p className="text-blue-700 font-medium">
                  Loading saved streamers...
                </p>
              </CardContent>
            </Card>
          ) : savedStreamers.length > 0 ? (
            <div className="w-full">
              <div className="border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden bg-white">
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
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  {savedStreamers.length} streamers in{" "}
                  {selectedFolder?.name || "All"}
                </div>
              </div>
            </div>
          ) : (
            <Card className="border-2 border-slate-200 shadow-lg bg-gradient-to-br from-white/90 to-slate-50/50">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <motion.div
                  className="bg-gradient-to-br from-slate-50 to-gray-50 p-8 rounded-full border-2 border-slate-200 mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <FolderX className="h-12 w-12 text-blue-500" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  No saved streamers found
                </h3>
                <p className="text-gray-600 text-center max-w-md leading-relaxed">
                  {searchQuery
                    ? "No streamers match your search criteria. Try adjusting your search terms."
                    : selectedFolder
                    ? "This folder is empty. Start adding streamers to organize your collection."
                    : "You haven't saved any streamers yet. Discover and save streamers from your searches."}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
