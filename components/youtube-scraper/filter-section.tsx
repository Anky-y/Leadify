"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from "lucide-react"

interface FilterSectionProps {
  language: string
  setLanguage: (value: string) => void
  category: string
  setCategory: (value: string) => void
  minSubscribers: number
  setMinSubscribers: (value: number) => void
  maxSubscribers: number
  setMaxSubscribers: (value: number) => void
  minViews: number
  setMinViews: (value: number) => void
  maxViews: number
  setMaxViews: (value: number) => void
  uploadFrequency: string
  setUploadFrequency: (value: string) => void
  onApplyFilters: () => void
  onResetFilters: () => void
}

export default function FilterSection({
  language,
  setLanguage,
  category,
  setCategory,
  minSubscribers,
  setMinSubscribers,
  maxSubscribers,
  setMaxSubscribers,
  minViews,
  setMinViews,
  maxViews,
  setMaxViews,
  uploadFrequency,
  setUploadFrequency,
  onApplyFilters,
  onResetFilters,
}: FilterSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Any language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any language</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="korean">Korean</SelectItem>
                <SelectItem value="portuguese">Portuguese</SelectItem>
                <SelectItem value="russian">Russian</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Any category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any category</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="beauty">Beauty</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="cooking">Cooking</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="upload-frequency">Upload Frequency</Label>
            <Select value={uploadFrequency} onValueChange={setUploadFrequency}>
              <SelectTrigger id="upload-frequency">
                <SelectValue placeholder="Any frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any frequency</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="irregular">Irregular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="subscribers">Subscribers</Label>
              <span className="text-xs text-gray-500">
                {minSubscribers.toLocaleString()} - {maxSubscribers.toLocaleString()}
              </span>
            </div>
            <div className="pt-2">
              <Slider
                id="subscribers"
                min={1000}
                max={10000000}
                step={1000}
                value={[minSubscribers, maxSubscribers]}
                onValueChange={(value) => {
                  setMinSubscribers(value[0])
                  setMaxSubscribers(value[1])
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="views">Average Views</Label>
              <span className="text-xs text-gray-500">
                {minViews.toLocaleString()} - {maxViews.toLocaleString()}
              </span>
            </div>
            <div className="pt-2">
              <Slider
                id="views"
                min={1000}
                max={100000000}
                step={1000}
                value={[minViews, maxViews]}
                onValueChange={(value) => {
                  setMinViews(value[0])
                  setMaxViews(value[1])
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={onApplyFilters} className="w-full bg-blue-700 hover:bg-blue-800">
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
