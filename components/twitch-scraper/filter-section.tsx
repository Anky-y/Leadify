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
import { FilterX } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800 h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className={cn(
            "h-8 px-2 text-gray-500",
            activeFiltersCount > 0 ? "opacity-100" : "opacity-50"
          )}
        >
          <FilterX className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["language", "followers", "viewers", "category"]}
        className="space-y-4"
      >
        <AccordionItem value="language" className="border-b-0">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              Language
              {language && language !== "any" && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {language}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="followers" className="border-b-0">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              Follower Count
              {(minFollowers > 1000 || maxFollowers < 10000000) && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {minFollowers > 1000 && maxFollowers < 10000000
                    ? `${minFollowers.toLocaleString()} - ${maxFollowers.toLocaleString()}`
                    : minFollowers > 1000
                    ? `>${minFollowers.toLocaleString()}`
                    : `<${maxFollowers.toLocaleString()}`}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-xs">Min Followers</Label>
                </div>
                <div className="flex gap-2 items-center">
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
                  <Input
                    type="text"
                    value={minFollowersInput}
                    onChange={(e) => handleMinFollowersChange(e.target.value)}
                    onBlur={handleMinFollowersBlur}
                    className="w-24 h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-xs">Max Followers</Label>
                </div>
                <div className="flex gap-2 items-center">
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
                  <Input
                    type="text"
                    value={maxFollowersInput}
                    onChange={(e) => handleMaxFollowersChange(e.target.value)}
                    onBlur={handleMaxFollowersBlur}
                    className="w-24 h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="viewers" className="border-b-0">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              Viewer Count
              {(minViewers > 10 || maxViewers < 100000) && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {minViewers > 10 && maxViewers < 100000
                    ? `${minViewers.toLocaleString()} - ${maxViewers.toLocaleString()}`
                    : minViewers > 10
                    ? `>${minViewers.toLocaleString()}`
                    : `<${maxViewers.toLocaleString()}`}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-xs">Min Viewers</Label>
                </div>
                <div className="flex gap-2 items-center">
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
                  <Input
                    type="text"
                    value={minViewersInput}
                    onChange={(e) => handleMinViewersChange(e.target.value)}
                    onBlur={handleMinViewersBlur}
                    className="w-24 h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-xs">Max Viewers</Label>
                </div>
                <div className="flex gap-2 items-center">
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
                  <Input
                    type="text"
                    value={maxViewersInput}
                    onChange={(e) => handleMaxViewersChange(e.target.value)}
                    onBlur={handleMaxViewersBlur}
                    className="w-24 h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border-b-0">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              Twitch Category
              {category && category !== "any" && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {category}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any category</SelectItem>
                <SelectItem value="just-chatting">Just Chatting</SelectItem>
                <SelectItem value="fortnite">Fortnite</SelectItem>
                <SelectItem value="league-of-legends">
                  League of Legends
                </SelectItem>
                <SelectItem value="valorant">Valorant</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        className="w-full mt-6 bg-blue-700 hover:bg-blue-800"
        onClick={onApplyFilters}
      >
        Search Now {activeFiltersCount > 0 && `(${activeFiltersCount})`}
      </Button>
    </div>
  );
}
