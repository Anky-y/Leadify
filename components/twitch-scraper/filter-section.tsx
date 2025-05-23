"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronRight,
  FilterX,
  SlidersHorizontal,
  Save,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from "@/app/context/UserContext";

interface FilterSectionProps {
  language: string;
  setLanguage: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  minFollowers: number;
  setMinFollowers: (value: number) => void;
  maxFollowers: number;
  setMaxFollowers: (value: number) => void;
  minViewers: number;
  setMinViewers: (value: number) => void;
  maxViewers: number;
  setMaxViewers: (value: number) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onSaveFilter?: () => void;
}

export default function FilterSection({
  language,
  setLanguage,
  category,
  setCategory,
  minFollowers,
  setMinFollowers,
  maxFollowers,
  setMaxFollowers,
  minViewers,
  setMinViewers,
  maxViewers,
  setMaxViewers,
  onApplyFilters,
  onResetFilters,
  isCollapsed,
  toggleCollapse,
  onSaveFilter,
}: FilterSectionProps) {
  // Local state for input fields to prevent excessive re-renders
  const [minFollowersInput, setMinFollowersInput] = useState(
    minFollowers.toString()
  );
  const [maxFollowersInput, setMaxFollowersInput] = useState(
    maxFollowers.toString()
  );
  const [minViewersInput, setMinViewersInput] = useState(minViewers.toString());
  const [maxViewersInput, setMaxViewersInput] = useState(maxViewers.toString());
  const [saveFilterDialogOpen, setSaveFilterDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const { user } = useUser();
  // Active filters count
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Update input fields when slider values change
  useEffect(() => {
    setMinFollowersInput(minFollowers.toString());
  }, [minFollowers]);

  useEffect(() => {
    setMaxFollowersInput(maxFollowers.toString());
  }, [maxFollowers]);

  useEffect(() => {
    setMinViewersInput(minViewers.toString());
  }, [minViewers]);

  useEffect(() => {
    setMaxViewersInput(maxViewers.toString());
  }, [maxViewers]);

  // Update active filters count
  useEffect(() => {
    let count = 0;
    if (language && language !== "any") count++;
    if (category && category !== "any") count++;
    if (minFollowers > 1000) count++;
    if (maxFollowers < 10000000) count++;
    if (minViewers > 10) count++;
    if (maxViewers < 100000) count++;
    setActiveFiltersCount(count);
  }, [language, category, minFollowers, maxFollowers, minViewers, maxViewers]);

  // Handle input changes with validation
  const handleMinFollowersChange = (value: string) => {
    setMinFollowersInput(value);
    const numValue = Number.parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= maxFollowers) {
      setMinFollowers(numValue);
    }
  };

  const handleMaxFollowersChange = (value: string) => {
    setMaxFollowersInput(value);
    const numValue = Number.parseInt(value);
    if (!isNaN(numValue) && numValue >= minFollowers) {
      setMaxFollowers(numValue);
    }
  };

  const handleMinViewersChange = (value: string) => {
    setMinViewersInput(value);
    const numValue = Number.parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= maxViewers) {
      setMinViewers(numValue);
    }
  };

  const handleMaxViewersChange = (value: string) => {
    setMaxViewersInput(value);
    const numValue = Number.parseInt(value);
    if (!isNaN(numValue) && numValue >= minViewers) {
      setMaxViewers(numValue);
    }
  };

  // Handle blur events to correct invalid inputs
  const handleMinFollowersBlur = () => {
    const numValue = Number.parseInt(minFollowersInput);
    if (isNaN(numValue) || numValue < 0) {
      setMinFollowersInput("0");
      setMinFollowers(0);
    } else if (numValue > maxFollowers) {
      setMinFollowersInput(maxFollowers.toString());
      setMinFollowers(maxFollowers);
    }
  };

  const handleMaxFollowersBlur = () => {
    const numValue = Number.parseInt(maxFollowersInput);
    if (isNaN(numValue) || numValue < minFollowers) {
      setMaxFollowersInput(minFollowers.toString());
      setMaxFollowers(minFollowers);
    }
  };

  const handleMinViewersBlur = () => {
    const numValue = Number.parseInt(minViewersInput);
    if (isNaN(numValue) || numValue < 0) {
      setMinViewersInput("0");
      setMinViewers(0);
    } else if (numValue > maxViewers) {
      setMinViewersInput(maxViewers.toString());
      setMinViewers(maxViewers);
    }
  };

  const handleMaxViewersBlur = () => {
    const numValue = Number.parseInt(maxViewersInput);
    if (isNaN(numValue) || numValue < minViewers) {
      setMaxViewersInput(minViewers.toString());
      setMaxViewers(minViewers);
    }
  };

  // Save filter to database
  const handleSaveFilter = async () => {
    if (!filterName.trim()) {
      toast.error("Please enter a name for your filter");

      return;
    }

    if (!category || category === "any") {
      toast.error("Please select a category before saving your filter");
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to save filters");

      return;
    }

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        headers["x-user-id"] = user.id;
      }
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}filters/save`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            user_id: user.id,
            name: filterName,
            language: language || null,
            category: category || null,
            min_followers: minFollowers,
            max_followers: maxFollowers,
            min_viewers: minViewers,
            max_viewers: maxViewers,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save filter");
      }

      toast.success(`Your filter "${filterName}" has been saved`);

      setSaveFilterDialogOpen(false);
      setFilterName("");

      // Call the onSaveFilter callback if provided
      if (onSaveFilter) {
        onSaveFilter();
      }
    } catch (error) {
      console.error("Error saving filter:", error);
      toast.error("Failed to save filter. Please try again.");

    }
  };

  // Animation variants for accordion items
  const accordionVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Badge animation
  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
  };

  // Collapsed filter section variants
  const collapsedVariants = {
    expanded: {
      width: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    collapsed: {
      width: "60px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Content variants
  const contentVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
    hidden: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 },
    },
  };

  // Number input animation
  const numberInputVariants = {
    initial: { scale: 1 },
    changed: {
      scale: [1, 1.05, 1],
      backgroundColor: [
        "transparent",
        "rgba(59, 130, 246, 0.1)",
        "transparent",
      ],
      transition: { duration: 0.4 },
    },
  };

  // Button animation
  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  return (
    <motion.div
      className={cn(
        "bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 h-fit shadow-sm overflow-hidden",
        isCollapsed ? "w-[60px]" : "w-full"
      )}
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={collapsedVariants}
    >
      {isCollapsed ? (
        <div className="h-full flex flex-col items-center py-6 px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="mb-4 hover:bg-gray-100 transition-colors"
            aria-label="Expand filters"
          >
            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="flex flex-col items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="hover:bg-gray-100 transition-colors"
              aria-label="Show filters"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </Button>
            {activeFiltersCount > 0 && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={badgeVariants}
                className="flex items-center justify-center w-6 h-6 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {activeFiltersCount}
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          className="p-6"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Filters</h2>
              {activeFiltersCount > 0 && (
                <motion.span
                  className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={badgeVariants}
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className={cn(
                  "h-8 px-2 text-gray-500 transition-all duration-200",
                  activeFiltersCount > 0 ? "opacity-100" : "opacity-50"
                )}
              >
                <FilterX className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapse}
                className="h-8 w-8 hover:bg-gray-100 transition-colors"
                aria-label="Collapse filters"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>

          <Accordion
            type="multiple"
            defaultValue={["language", "followers", "viewers", "category"]}
            className="space-y-4"
          >
            <AccordionItem
              value="language"
              className="border-b-0 rounded-md overflow-hidden"
            >
              <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline group bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                <div className="flex items-center gap-2">
                  <span className="transition-colors group-hover:text-blue-700">
                    Language
                  </span>
                  {language && language !== "any" && (
                    <motion.span
                      className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={badgeVariants}
                    >
                      {language}
                    </motion.span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-1">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="transition-all hover:border-blue-300 focus:ring-blue-200 focus:ring-offset-2">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any language</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="followers"
              className="border-b-0 rounded-md overflow-hidden"
            >
              <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline group bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                <div className="flex items-center gap-2">
                  <span className="transition-colors group-hover:text-blue-700">
                    Follower Count
                  </span>
                  {(minFollowers > 1000 || maxFollowers < 10000000) && (
                    <motion.span
                      className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={badgeVariants}
                    >
                      {minFollowers > 1000 && maxFollowers < 10000000
                        ? `${minFollowers.toLocaleString()} - ${maxFollowers.toLocaleString()}`
                        : minFollowers > 1000
                        ? `>${minFollowers.toLocaleString()}`
                        : `<${maxFollowers.toLocaleString()}`}
                    </motion.span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-1">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-xs font-medium text-gray-600">
                        Min Followers
                      </Label>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex-1">
                        <Slider
                          value={[minFollowers]}
                          min={0}
                          max={10000000}
                          step={1000}
                          onValueChange={(value) => setMinFollowers(value[0])}
                          className="my-2"
                        />
                      </div>
                      <motion.div
                        initial="initial"
                        animate={
                          minFollowersInput !== minFollowers.toString()
                            ? "changed"
                            : "initial"
                        }
                        variants={numberInputVariants}
                        className="relative"
                      >
                        <Input
                          type="text"
                          value={minFollowersInput}
                          onChange={(e) =>
                            handleMinFollowersChange(e.target.value)
                          }
                          onBlur={handleMinFollowersBlur}
                          className="w-24 h-9 text-sm transition-all hover:border-blue-300 focus:ring-blue-200 focus:ring-offset-2 focus:border-blue-300"
                        />
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-xs font-medium text-gray-600">
                        Max Followers
                      </Label>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex-1">
                        <Slider
                          value={[maxFollowers]}
                          min={0}
                          max={10000000}
                          step={1000}
                          onValueChange={(value) => setMaxFollowers(value[0])}
                          className="my-2"
                        />
                      </div>
                      <motion.div
                        initial="initial"
                        animate={
                          maxFollowersInput !== maxFollowers.toString()
                            ? "changed"
                            : "initial"
                        }
                        variants={numberInputVariants}
                        className="relative"
                      >
                        <Input
                          type="text"
                          value={maxFollowersInput}
                          onChange={(e) =>
                            handleMaxFollowersChange(e.target.value)
                          }
                          onBlur={handleMaxFollowersBlur}
                          className="w-24 h-9 text-sm transition-all hover:border-blue-300 focus:ring-blue-200 focus:ring-offset-2 focus:border-blue-300"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="viewers"
              className="border-b-0 rounded-md overflow-hidden"
            >
              <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline group bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                <div className="flex items-center gap-2">
                  <span className="transition-colors group-hover:text-blue-700">
                    Viewer Count
                  </span>
                  {(minViewers > 10 || maxViewers < 100000) && (
                    <motion.span
                      className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={badgeVariants}
                    >
                      {minViewers > 10 && maxViewers < 100000
                        ? `${minViewers.toLocaleString()} - ${maxViewers.toLocaleString()}`
                        : minViewers > 10
                        ? `>${minViewers.toLocaleString()}`
                        : `<${maxViewers.toLocaleString()}`}
                    </motion.span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-1">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-xs font-medium text-gray-600">
                        Min Viewers
                      </Label>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex-1">
                        <Slider
                          value={[minViewers]}
                          min={0}
                          max={100000}
                          step={10}
                          onValueChange={(value) => setMinViewers(value[0])}
                          className="my-2"
                        />
                      </div>
                      <motion.div
                        initial="initial"
                        animate={
                          minViewersInput !== minViewers.toString()
                            ? "changed"
                            : "initial"
                        }
                        variants={numberInputVariants}
                        className="relative"
                      >
                        <Input
                          type="text"
                          value={minViewersInput}
                          onChange={(e) =>
                            handleMinViewersChange(e.target.value)
                          }
                          onBlur={handleMinViewersBlur}
                          className="w-24 h-9 text-sm transition-all hover:border-blue-300 focus:ring-blue-200 focus:ring-offset-2 focus:border-blue-300"
                        />
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-xs font-medium text-gray-600">
                        Max Viewers
                      </Label>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="flex-1">
                        <Slider
                          value={[maxViewers]}
                          min={0}
                          max={100000}
                          step={10}
                          onValueChange={(value) => setMaxViewers(value[0])}
                          className="my-2"
                        />
                      </div>
                      <motion.div
                        initial="initial"
                        animate={
                          maxViewersInput !== maxViewers.toString()
                            ? "changed"
                            : "initial"
                        }
                        variants={numberInputVariants}
                        className="relative"
                      >
                        <Input
                          type="text"
                          value={maxViewersInput}
                          onChange={(e) =>
                            handleMaxViewersChange(e.target.value)
                          }
                          onBlur={handleMaxViewersBlur}
                          className="w-24 h-9 text-sm transition-all hover:border-blue-300 focus:ring-blue-200 focus:ring-offset-2 focus:border-blue-300"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="category"
              className="border-b-0 rounded-md overflow-hidden"
            >
              <AccordionTrigger className="text-sm font-medium py-3 px-4 hover:no-underline group bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                <div className="flex items-center gap-2">
                  <span className="transition-colors group-hover:text-blue-700">
                    Twitch Category
                  </span>
                  {category && category !== "any" && (
                    <motion.span
                      className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={badgeVariants}
                    >
                      {category}
                    </motion.span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-1">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="transition-all hover:border-blue-300 focus:ring-blue-200 focus:ring-offset-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any category</SelectItem>
                      <SelectItem value="just-chatting">
                        Just Chatting
                      </SelectItem>
                      <SelectItem value="fortnite">Fortnite</SelectItem>
                      <SelectItem value="league-of-legends">
                        League of Legends
                      </SelectItem>
                      <SelectItem value="valorant">Valorant</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6 space-y-3">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              transition={{ duration: 0.2 }}
            >
              <Button
                className="w-full py-6 bg-blue-700 hover:bg-blue-800 transition-all duration-300 shadow-sm hover:shadow"
                onClick={onApplyFilters}
              >
                Search Now {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </motion.div>

            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              transition={{ duration: 0.2 }}
            >
              <Dialog
                open={saveFilterDialogOpen}
                onOpenChange={setSaveFilterDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 transition-all"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Current Filter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Filter</DialogTitle>
                    <DialogDescription>
                      Save your current filter settings for future use.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="filter-name">Filter Name</Label>
                    <Input
                      id="filter-name"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="e.g., English Fortnite Streamers"
                      className="mt-2"
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      Current Filter Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                      <div>
                        <span className="font-medium">Language:</span>{" "}
                        {language || "Any"}
                      </div>
                      <div>
                        <span className="font-medium">
                          Category<span className="text-red-500">*</span>:
                        </span>{" "}
                        {category || "Any"}
                      </div>
                      <div>
                        <span className="font-medium">Followers:</span>{" "}
                        {minFollowers.toLocaleString()} -{" "}
                        {maxFollowers.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Viewers:</span>{" "}
                        {minViewers.toLocaleString()} -{" "}
                        {maxViewers.toLocaleString()}
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                      <span className="text-red-500">*</span> Required field
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setSaveFilterDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveFilter}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
