"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronRight,
  FilterX,
  SlidersHorizontal,
  Save,
  Search,
  Settings,
  CheckCircle,
  XCircle,
  FolderPlus,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useUser } from "@/app/context/UserContext";
import type { Category, Language } from "./types";

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
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesIsOpen, setCategoriesIsOpen] = useState(false);
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageSearchOpen, setLanguageSearchOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");

  // Fetch languages and categories when dropdowns open
  useEffect(() => {
    if (categoriesIsOpen || categorySearchOpen) {
      fetchCategories();
    }
    if (languageSearchOpen) {
      fetchLanguages();
    }
  }, [categoriesIsOpen, categorySearchOpen, languageSearchOpen]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}categories`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const { data } = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}languages`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch languages");
      }
      const { data } = await res.json();
      setLanguages(data);
    } catch (err) {
      console.error("Failed to fetch languages:", err);
    }
  };

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;

    const searchTerm = categorySearch.toLowerCase();
    return categories
      .filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm) ||
          cat.value.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => {
        // Prioritize exact matches and starts-with matches
        const aNameMatch = a.name.toLowerCase().indexOf(searchTerm);
        const bNameMatch = b.name.toLowerCase().indexOf(searchTerm);

        if (aNameMatch === 0 && bNameMatch !== 0) return -1;
        if (bNameMatch === 0 && aNameMatch !== 0) return 1;
        if (aNameMatch !== bNameMatch) return aNameMatch - bNameMatch;

        // Then sort by viewer count (descending)
        return b.viewers - a.viewers;
      });
  }, [categories, categorySearch]);

  // Filter languages based on search
  const filteredLanguages = useMemo(() => {
    if (!languageSearch.trim()) return languages;

    const searchTerm = languageSearch.toLowerCase();
    return languages
      .filter(
        (lang) =>
          lang.name.toLowerCase().includes(searchTerm) ||
          lang.value.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => {
        // Prioritize exact matches and starts-with matches
        const aNameMatch = a.name.toLowerCase().indexOf(searchTerm);
        const bNameMatch = b.name.toLowerCase().indexOf(searchTerm);

        if (aNameMatch === 0 && bNameMatch !== 0) return -1;
        if (bNameMatch === 0 && aNameMatch !== 0) return 1;
        if (aNameMatch !== bNameMatch) return aNameMatch - bNameMatch;

        // Then sort alphabetically
        return a.name.localeCompare(b.name);
      });
  }, [languages, languageSearch]);

  // Get selected category display name
  const selectedCategoryName = useMemo(() => {
    if (!category || category === "any") return "Any category";
    const selectedCat = categories.find((cat) => cat.value === category);
    return selectedCat ? selectedCat.name : category;
  }, [category, categories]);

  // Get selected language display name
  const selectedLanguageName = useMemo(() => {
    if (!language || language === "any") return "Any language";
    const selectedLang = languages.find((lang) => lang.value === language);
    return selectedLang ? selectedLang.name : language;
  }, [language, languages]);

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

  const handleSaveFilter = async () => {
    if (!filterName.trim()) {
      toast.error("Filter Name Required", {
        description: "Please enter a name for your filter before saving.",
        icon: <XCircle className="h-5 w-5" />,
      });
      return;
    }

    if (!category || category === "any") {
      toast.error("Category Required", {
        description: "Please select a category before saving your filter.",
        icon: <XCircle className="h-5 w-5" />,
      });
      return;
    }

    if (!user?.id) {
      toast.error("Authentication Required", {
        description: "Please log in to save filters.",
        icon: <XCircle className="h-5 w-5" />,
      });
      return;
    }

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.id) {
        headers["x-user-id"] = user.id;
      }

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

      toast.success("Filter Saved Successfully", {
        description: `Your filter "${filterName}" has been saved and can be reused anytime.`,
        icon: <CheckCircle className="h-5 w-5" />,
      });

      setSaveFilterDialogOpen(false);
      setFilterName("");

      if (onSaveFilter) {
        onSaveFilter();
      }
    } catch (error) {
      console.error("Error saving filter:", error);
      toast.error("Failed to Save Filter", {
        description: "Unable to save your filter. Please try again later.",
        icon: <XCircle className="h-5 w-5" />,
        action: {
          label: "Retry",
          onClick: () => handleSaveFilter(),
        },
      });
    }
  };

  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
  };

  const collapsedVariants = {
    expanded: {
      width: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    collapsed: {
      width: "80px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

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

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  return (
    <motion.div
      className={cn(
        "bg-gradient-to-br from-white/95 to-slate-50/80 rounded-xl border-2 border-slate-200 shadow-lg overflow-hidden backdrop-blur-sm",
        isCollapsed ? "w-[80px]" : "w-full min-h-[calc(100vh-200px)]"
      )}
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={collapsedVariants}
    >
      {isCollapsed ? (
        <div className="h-full flex flex-col items-center py-8 px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="mb-6 hover:bg-blue-50 transition-colors border border-blue-200 text-blue-600"
            aria-label="Expand filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center gap-6 mt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="hover:bg-blue-50 transition-colors text-blue-600"
              aria-label="Show filters"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            {activeFiltersCount > 0 && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={badgeVariants}
                className="flex items-center justify-center w-8 h-8 text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm"
              >
                {activeFiltersCount}
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          className="p-6 h-full flex flex-col"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Search Filters
              </h2>
              {activeFiltersCount > 0 && (
                <motion.span
                  className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm"
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
                  "h-8 px-3 text-blue-600 transition-all duration-200 hover:bg-blue-50 border border-blue-200",
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
                className="h-8 w-8 hover:bg-blue-50 transition-colors text-blue-600 border border-blue-200"
                aria-label="Collapse filters"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Accordion
              type="multiple"
              defaultValue={["language", "followers", "viewers", "category"]}
              className="space-y-4"
            >
              <AccordionItem
                value="language"
                className="border-b-0 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="text-sm font-semibold py-4 px-4 hover:no-underline group bg-gradient-to-r from-slate-50 to-gray-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all duration-200 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="transition-colors group-hover:text-blue-700 text-blue-600">
                      Language
                    </span>
                    {language && language !== "any" && (
                      <motion.span
                        className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm max-w-32 truncate"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={badgeVariants}
                        title={selectedLanguageName}
                      >
                        {selectedLanguageName}
                      </motion.span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-2">
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Popover
                      open={languageSearchOpen}
                      onOpenChange={setLanguageSearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={languageSearchOpen}
                          className="w-full justify-between transition-all hover:border-blue-400 focus:ring-blue-200 focus:ring-offset-2 border-blue-200 bg-transparent"
                        >
                          <span className="truncate">
                            {selectedLanguageName}
                          </span>
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0 border-blue-100"
                        align="start"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search languages..."
                            value={languageSearch}
                            onValueChange={setLanguageSearch}
                            className="border-0 focus:ring-0"
                          />
                          <CommandList className="max-h-60">
                            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <Search className="h-8 w-8 text-gray-300" />
                                <span>No languages found</span>
                                <span className="text-xs">
                                  Try a different search term
                                </span>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value="any"
                                onSelect={() => {
                                  setLanguage("any");
                                  setLanguageSearchOpen(false);
                                  setLanguageSearch("");
                                }}
                                className="cursor-pointer hover:bg-blue-50"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium">
                                    Any language
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    All languages
                                  </span>
                                </div>
                              </CommandItem>
                              <AnimatePresence>
                                {filteredLanguages.map((lang, index) => (
                                  <motion.div
                                    key={lang.value}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{
                                      opacity: 1,
                                      y: 0,
                                      transition: {
                                        delay: index * 0.02,
                                        duration: 0.2,
                                      },
                                    }}
                                    exit={{
                                      opacity: 0,
                                      y: -10,
                                      transition: { duration: 0.1 },
                                    }}
                                  >
                                    <CommandItem
                                      value={lang.name}
                                      onSelect={() => {
                                        setLanguage(lang.value);
                                        setLanguageSearchOpen(false);
                                        setLanguageSearch("");
                                      }}
                                      className="cursor-pointer hover:bg-blue-50 transition-colors"
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span className="font-medium truncate flex-1 mr-2">
                                          {lang.name}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="category"
                className="border-b-0 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="text-sm font-semibold py-4 px-4 hover:no-underline group bg-gradient-to-r from-slate-50 to-gray-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all duration-200 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="transition-colors group-hover:text-blue-700 text-blue-600">
                      Twitch Category
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                      (100+ viewers only)
                    </span>
                    {category && category !== "any" && (
                      <motion.span
                        className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm max-w-32 truncate"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={badgeVariants}
                        title={selectedCategoryName}
                      >
                        {selectedCategoryName}
                      </motion.span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-2">
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Popover
                      open={categorySearchOpen}
                      onOpenChange={setCategorySearchOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={categorySearchOpen}
                          className="w-full justify-between transition-all hover:border-blue-400 focus:ring-blue-200 focus:ring-offset-2 border-blue-200 bg-transparent"
                        >
                          <span className="truncate">
                            {selectedCategoryName}
                          </span>
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0 border-blue-100"
                        align="start"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search categories..."
                            value={categorySearch}
                            onValueChange={setCategorySearch}
                            className="border-0 focus:ring-0"
                          />
                          <CommandList className="max-h-60">
                            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <Search className="h-8 w-8 text-gray-300" />
                                <span>No categories found</span>
                                <span className="text-xs">
                                  Try a different search term
                                </span>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value="any"
                                onSelect={() => {
                                  setCategory("any");
                                  setCategorySearchOpen(false);
                                  setCategorySearch("");
                                }}
                                className="cursor-pointer hover:bg-blue-50"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium">
                                    Any category
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    All categories
                                  </span>
                                </div>
                              </CommandItem>
                              <AnimatePresence>
                                {filteredCategories.map((cat, index) => (
                                  <motion.div
                                    key={cat.value}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{
                                      opacity: 1,
                                      y: 0,
                                      transition: {
                                        delay: index * 0.02,
                                        duration: 0.2,
                                      },
                                    }}
                                    exit={{
                                      opacity: 0,
                                      y: -10,
                                      transition: { duration: 0.1 },
                                    }}
                                  >
                                    <CommandItem
                                      value={cat.name}
                                      onSelect={() => {
                                        setCategory(cat.value);
                                        setCategorySearchOpen(false);
                                        setCategorySearch("");
                                      }}
                                      className="cursor-pointer hover:bg-blue-50 transition-colors"
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span className="font-medium truncate flex-1 mr-2">
                                          {cat.name}
                                        </span>
                                        <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full">
                                          {cat.viewers.toLocaleString()}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="followers"
                className="border-b-0 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="text-sm font-semibold py-4 px-4 hover:no-underline group bg-gradient-to-r from-slate-50 to-gray-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all duration-200 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="transition-colors group-hover:text-blue-700 text-blue-600">
                      Follower Count
                    </span>
                    {(minFollowers > 1000 || maxFollowers < 10000000) && (
                      <motion.span
                        className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm"
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
                <AccordionContent className="pt-4 px-2">
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex justify-between mb-3">
                        <Label className="text-sm font-semibold text-blue-600">
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
                            className="my-3"
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
                            className="w-32 h-10 text-sm transition-all hover:border-blue-400 focus:ring-blue-200 focus:ring-offset-2 focus:border-blue-400 border-blue-200"
                          />
                        </motion.div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-3">
                        <Label className="text-sm font-semibold text-blue-600">
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
                            className="my-3"
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
                            className="w-32 h-10 text-sm transition-all hover:border-blue-400 focus:ring-blue-200 focus:ring-offset-2 focus:border-blue-400 border-blue-200"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="viewers"
                className="border-b-0 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="text-sm font-semibold py-4 px-4 hover:no-underline group bg-gradient-to-r from-slate-50 to-gray-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all duration-200 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="transition-colors group-hover:text-blue-700 text-blue-600">
                      Viewer Count
                    </span>
                    {(minViewers > 10 || maxViewers < 100000) && (
                      <motion.span
                        className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm"
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
                <AccordionContent className="pt-4 px-2">
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex justify-between mb-3">
                        <Label className="text-sm font-semibold text-blue-600">
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
                            className="my-3"
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
                            className="w-32 h-10 text-sm transition-all hover:border-blue-400 focus:ring-blue-200 focus:ring-offset-2 focus:border-blue-400 border-blue-200"
                          />
                        </motion.div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-3">
                        <Label className="text-sm font-semibold text-blue-600">
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
                            className="my-3"
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
                            className="w-32 h-10 text-sm transition-all hover:border-blue-400 focus:ring-blue-200 focus:ring-offset-2 focus:border-blue-400 border-blue-200"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-6 space-y-4 pt-4 border-t border-slate-200">
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              transition={{ duration: 0.2 }}
            >
              <Button
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-semibold text-base"
                onClick={onApplyFilters}
              >
                <Search className="mr-2 h-5 w-5" />
                Search Now{" "}
                {activeFiltersCount > 0 && `(${activeFiltersCount} filters)`}
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
                    className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 py-3 bg-transparent"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Current Filter
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-blue-100">
                  <DialogHeader>
                    <DialogTitle className="text-blue-800 flex items-center gap-2">
                      <FolderPlus className="h-5 w-5" />
                      Save Filter
                    </DialogTitle>
                    <DialogDescription>
                      Save your current filter settings for future use.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="filter-name" className="text-blue-700">
                      Filter Name
                    </Label>
                    <Input
                      id="filter-name"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="e.g., English Fortnite Streamers"
                      className="mt-2 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                    />
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 mb-3">
                      Current Filter Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs text-blue-700">
                      <div>
                        <span className="font-semibold">Language:</span>{" "}
                        {language || "Any"}
                      </div>
                      <div>
                        <span className="font-semibold">
                          Category<span className="text-red-500">*</span>:
                        </span>{" "}
                        {selectedCategoryName}
                      </div>
                      <div>
                        <span className="font-semibold">Followers:</span>{" "}
                        {minFollowers.toLocaleString()} -{" "}
                        {maxFollowers.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold">Viewers:</span>{" "}
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
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveFilter}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Save Filter
                    </Button>
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
