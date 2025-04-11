"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, RefreshCw, Plus, Filter, UploadCloud, Mail } from "lucide-react"
import CrmDataTable from "./crm-data-table"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

// Types
import type { CrmLead } from "./types"

interface CrmUIProps {
  initialSubscribed?: boolean
}

export default function CrmUI({ initialSubscribed = false }: CrmUIProps) {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState<string>("")
  const [stageFilter, setStageFilter] = useState<string>("")
  const [sequenceFilter, setSequenceFilter] = useState<string>("")
  const [classificationFilter, setClassificationFilter] = useState<string>("")
  const [repliedFilter, setRepliedFilter] = useState<string>("")

  // State for UI
  const [isLoading, setIsLoading] = useState(false)
  const [leads, setLeads] = useState<CrmLead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<CrmLead[]>([])
  const [subscribed, setSubscribed] = useState(initialSubscribed)
  const [exportFormat, setExportFormat] = useState("csv")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showEmailSequenceDialog, setShowEmailSequenceDialog] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const { toast } = useToast()

  // Load leads from localStorage on component mount
  useEffect(() => {
    const leadsFromStorage = localStorage.getItem("crmLeads")
    if (leadsFromStorage) {
      const parsedLeads = JSON.parse(leadsFromStorage)
      setLeads(parsedLeads)
      setFilteredLeads(parsedLeads)
    }
  }, [])

  // Apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [searchTerm, platformFilter, stageFilter, sequenceFilter, classificationFilter, repliedFilter, leads])

  const applyFilters = () => {
    let filtered = [...leads]

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply platform filter
    if (platformFilter) {
      filtered = filtered.filter((lead) => lead.platform === platformFilter)
    }

    // Apply stage filter
    if (stageFilter) {
      filtered = filtered.filter((lead) => lead.stage === stageFilter)
    }

    // Apply sequence filter
    if (sequenceFilter) {
      filtered = filtered.filter((lead) => lead.sequenceStatus === sequenceFilter)
    }

    // Apply classification filter
    if (classificationFilter) {
      filtered = filtered.filter((lead) => lead.classification === classificationFilter)
    }

    // Apply replied filter
    if (repliedFilter) {
      filtered = filtered.filter((lead) => (repliedFilter === "true" ? lead.replied : !lead.replied))
    }

    setFilteredLeads(filtered)
  }

  const handleExport = () => {
    if (filteredLeads.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no leads to export.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would generate a file in the selected format
    toast({
      title: `Exporting data as ${exportFormat.toUpperCase()}`,
      description: `${filteredLeads.length} leads will be exported.`,
    })
  }

  const handleUpload = () => {
    if (!uploadFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would parse the file and add the leads
    // For now, we'll just simulate it with some mock data
    const newLeads: CrmLead[] = [
      {
        id: `upload-${Date.now()}-1`,
        name: "Uploaded Lead 1",
        platform: "Manual Upload",
        followers: 25000,
        engagement: 5000,
        language: "english",
        category: "business",
        email: "lead1@example.com",
        social: {
          twitter: "https://twitter.com/lead1",
        },
        url: "https://example.com/lead1",
        sequenceStatus: "Not Started",
        stage: "New Lead",
        replied: false,
        classification: "Unclassified",
        dateAdded: new Date().toISOString(),
      },
      {
        id: `upload-${Date.now()}-2`,
        name: "Uploaded Lead 2",
        platform: "Manual Upload",
        followers: 50000,
        engagement: 10000,
        language: "english",
        category: "tech",
        email: "lead2@example.com",
        social: {
          twitter: "https://twitter.com/lead2",
        },
        url: "https://example.com/lead2",
        sequenceStatus: "Not Started",
        stage: "New Lead",
        replied: false,
        classification: "Unclassified",
        dateAdded: new Date().toISOString(),
      },
    ]

    // Add new leads to existing leads
    const updatedLeads = [...leads, ...newLeads]
    setLeads(updatedLeads)
    localStorage.setItem("crmLeads", JSON.stringify(updatedLeads))

    setShowUploadDialog(false)
    setUploadFile(null)

    toast({
      title: "Leads Uploaded",
      description: `${newLeads.length} leads have been added to your CRM.`,
    })
  }

  const handleAddToEmailSequence = () => {
    if (selectedLeads.length === 0) {
      toast({
        title: "No leads selected",
        description: "Please select at least one lead to add to an email sequence.",
        variant: "destructive",
      })
      return
    }

    // Update the selected leads with the new sequence status
    const updatedLeads = leads.map((lead) => {
      if (selectedLeads.includes(lead.id)) {
        return {
          ...lead,
          sequenceStatus: "In Progress",
          stage: "1st Email",
        }
      }
      return lead
    })

    setLeads(updatedLeads)
    localStorage.setItem("crmLeads", JSON.stringify(updatedLeads))
    setSelectedLeads([])
    setShowEmailSequenceDialog(false)

    toast({
      title: "Added to Email Sequence",
      description: `${selectedLeads.length} leads have been added to the email sequence.`,
    })
  }

  const handleLeadUpdate = (updatedLead: CrmLead) => {
    const updatedLeads = leads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))

    setLeads(updatedLeads)
    localStorage.setItem("crmLeads", JSON.stringify(updatedLeads))

    toast({
      title: "Lead Updated",
      description: `Lead "${updatedLead.name}" has been updated.`,
    })
  }

  const resetFilters = () => {
    setSearchTerm("")
    setPlatformFilter("")
    setStageFilter("")
    setSequenceFilter("")
    setClassificationFilter("")
    setRepliedFilter("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
        <p className="text-muted-foreground">Manage your leads and email sequences.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
              onClick={() => applyFilters()}
              disabled={isLoading}
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Leads</DialogTitle>
                <DialogDescription>Filter your leads by various criteria.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform-filter" className="text-right">
                    Platform
                  </Label>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger id="platform-filter" className="col-span-3">
                      <SelectValue placeholder="All platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All platforms</SelectItem>
                      <SelectItem value="Twitch">Twitch</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Manual Upload">Manual Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stage-filter" className="text-right">
                    Stage
                  </Label>
                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger id="stage-filter" className="col-span-3">
                      <SelectValue placeholder="All stages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All stages</SelectItem>
                      <SelectItem value="New Lead">New Lead</SelectItem>
                      <SelectItem value="1st Email">1st Email</SelectItem>
                      <SelectItem value="1st Follow-up">1st Follow-up</SelectItem>
                      <SelectItem value="2nd Follow-up">2nd Follow-up</SelectItem>
                      <SelectItem value="Final Follow-up">Final Follow-up</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sequence-filter" className="text-right">
                    Sequence Status
                  </Label>
                  <Select value={sequenceFilter} onValueChange={setSequenceFilter}>
                    <SelectTrigger id="sequence-filter" className="col-span-3">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="classification-filter" className="text-right">
                    Classification
                  </Label>
                  <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                    <SelectTrigger id="classification-filter" className="col-span-3">
                      <SelectValue placeholder="All classifications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All classifications</SelectItem>
                      <SelectItem value="Unclassified">Unclassified</SelectItem>
                      <SelectItem value="Hot Lead">Hot Lead</SelectItem>
                      <SelectItem value="Warm Lead">Warm Lead</SelectItem>
                      <SelectItem value="Cold Lead">Cold Lead</SelectItem>
                      <SelectItem value="Not Interested">Not Interested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="replied-filter" className="text-right">
                    Replied
                  </Label>
                  <Select value={repliedFilter} onValueChange={setRepliedFilter}>
                    <SelectTrigger id="replied-filter" className="col-span-3">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Button onClick={() => applyFilters()}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Leads
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Leads</DialogTitle>
                <DialogDescription>Upload a CSV or Excel file with your leads.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="lead-file">File</Label>
                <Input
                  id="lead-file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="mt-2"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Your file should include columns for name, email, and other lead information.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showEmailSequenceDialog} onOpenChange={setShowEmailSequenceDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Mail className="mr-2 h-4 w-4" />
                Email Sequence
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Email Sequence</DialogTitle>
                <DialogDescription>Add selected leads to an email sequence.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-500">
                  {selectedLeads.length === 0
                    ? "Please select leads from the table to add them to an email sequence."
                    : `You have selected ${selectedLeads.length} lead(s) to add to an email sequence.`}
                </p>
                {selectedLeads.length > 0 && (
                  <div className="mt-4">
                    <Label htmlFor="sequence-select">Select Sequence</Label>
                    <Select defaultValue="default">
                      <SelectTrigger id="sequence-select" className="mt-2">
                        <SelectValue placeholder="Select a sequence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Outreach Sequence</SelectItem>
                        <SelectItem value="follow-up">Follow-up Sequence</SelectItem>
                        <SelectItem value="nurture">Lead Nurturing Sequence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEmailSequenceDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddToEmailSequence} disabled={selectedLeads.length === 0}>
                  Add to Sequence
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {platformFilter && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Platform: {platformFilter}
            </Badge>
          )}
          {stageFilter && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              Stage: {stageFilter}
            </Badge>
          )}
          {sequenceFilter && (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Sequence: {sequenceFilter}
            </Badge>
          )}
          {classificationFilter && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              Classification: {classificationFilter}
            </Badge>
          )}
          {repliedFilter && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              Replied: {repliedFilter === "true" ? "Yes" : "No"}
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500">{filteredLeads.length} leads</div>
      </div>

      {filteredLeads.length > 0 ? (
        <CrmDataTable
          data={filteredLeads}
          subscribed={subscribed}
          selectedLeads={selectedLeads}
          setSelectedLeads={setSelectedLeads}
          onLeadUpdate={handleLeadUpdate}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Plus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No leads found</h3>
              <p className="text-gray-500 max-w-md">
                {leads.length > 0
                  ? "No leads match your current filters. Try adjusting your search or filters."
                  : "You don't have any leads yet. Add leads from the Twitch or YouTube scrapers, or upload a list of leads."}
              </p>
              {leads.length > 0 ? (
                <Button className="mt-4 bg-blue-700 hover:bg-blue-800" onClick={resetFilters}>
                  Reset Filters
                </Button>
              ) : (
                <div className="flex gap-2 justify-center mt-4">
                  <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => setShowUploadDialog(true)}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Leads
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
