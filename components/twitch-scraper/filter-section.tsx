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
  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-8 px-2 text-gray-500"
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
            Language
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
            Follower Count
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-xs">Min Followers</Label>
                  <span className="text-xs font-medium">
                    {minFollowers.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[minFollowers]}
                  min={0}
                  max={10000000}
                  step={1000}
                  onValueChange={(value) => setMinFollowers(value[0])}
                  className="my-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-xs">Max Followers</Label>
                  <span className="text-xs font-medium">
                    {maxFollowers.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[maxFollowers]}
                  min={0}
                  max={10000000}
                  step={1000}
                  onValueChange={(value) => setMaxFollowers(value[0])}
                  className="my-2"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="viewers" className="border-b-0">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            Viewer Count
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-xs">Min Viewers</Label>
                  <span className="text-xs font-medium">
                    {minViewers.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[minViewers]}
                  min={0}
                  max={100000}
                  step={10}
                  onValueChange={(value) => setMinViewers(value[0])}
                  className="my-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <Label className="text-xs">Max Viewers</Label>
                  <span className="text-xs font-medium">
                    {maxViewers.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[maxViewers]}
                  min={0}
                  max={100000}
                  step={10}
                  onValueChange={(value) => setMaxViewers(value[0])}
                  className="my-2"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border-b-0">
          <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
            Twitch Category
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
        Apply Filters
      </Button>
    </div>
  );
}
