"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EnvelopeSimple } from "../twitch-scraper/social-icons"
import { ExternalLink, Eye, EyeOff, Edit, Check, X, HelpCircle, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import type { CrmLead } from "./types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CrmDataTableProps {
  data: CrmLead[]
  subscribed: boolean
  selectedLeads: string[]
  setSelectedLeads: (ids: string[]) => void
  onLeadUpdate: (lead: CrmLead) => void
}

export default function CrmDataTable({
  data,
  subscribed,
  selectedLeads,
  setSelectedLeads,
  onLeadUpdate,
}: CrmDataTableProps) {
  // State to track which emails are revealed
  const [revealedEmails, setRevealedEmails] = useState<Record<string, boolean>>({})
  const [editingLead, setEditingLead] = useState<CrmLead | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Toggle email visibility for a specific row
  const toggleEmailVisibility = (id: string) => {
    setRevealedEmails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Toggle selection of a lead
  const toggleLeadSelection = (id: string) => {
    setSelectedLeads(
      selectedLeads.includes(id) ? selectedLeads.filter((leadId) => leadId !== id) : [...selectedLeads, id],
    )
  }

  // Toggle selection of all leads
  const toggleAllLeads = () => {
    setSelectedLeads(selectedLeads.length === data.length ? [] : data.map((lead) => lead.id))
  }

  // Handle editing a lead
  const handleEditLead = (lead: CrmLead) => {
    setEditingLead(lead)
    setShowEditDialog(true)
  }

  // Handle saving edited lead
  const handleSaveEdit = () => {
    if (editingLead) {
      onLeadUpdate(editingLead)
      setShowEditDialog(false)
      setEditingLead(null)
    }
  }

  // Get badge color based on sequence status
  const getSequenceStatusBadge = (status: string) => {
    switch (status) {
      case "Not Started":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            Not Started
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            In Progress
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Completed
          </Badge>
        )
      case "Paused":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Paused
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get badge color based on stage
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "New Lead":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            New Lead
          </Badge>
        )
      case "1st Email":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
            1st Email
          </Badge>
        )
      case "1st Follow-up":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            1st Follow-up
          </Badge>
        )
      case "2nd Follow-up":
        return (
          <Badge variant="outline" className="bg-cyan-50 text-cyan-700">
            2nd Follow-up
          </Badge>
        )
      case "Final Follow-up":
        return (
          <Badge variant="outline" className="bg-teal-50 text-teal-700">
            Final Follow-up
          </Badge>
        )
      case "Converted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Converted
          </Badge>
        )
      default:
        return <Badge variant="outline">{stage}</Badge>
    }
  }

  // Get badge color based on classification
  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case "Unclassified":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            Unclassified
          </Badge>
        )
      case "Hot Lead":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Hot Lead
          </Badge>
        )
      case "Warm Lead":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Warm Lead
          </Badge>
        )
      case "Cold Lead":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Cold Lead
          </Badge>
        )
      case "Not Interested":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            Not Interested
          </Badge>
        )
      default:
        return <Badge variant="outline">{classification}</Badge>
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedLeads.length === data.length && data.length > 0}
                  onCheckedChange={() => toggleAllLeads()}
                />
              </TableHead>
              <TableHead className="w-[180px]">Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right">Followers</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sequence Status</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Replied</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No leads found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLeads.includes(row.id)}
                      onCheckedChange={() => toggleLeadSelection(row.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{row.name}</span>
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.platform}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{row.followers.toLocaleString()}</TableCell>
                  <TableCell>
                    {row.email ? (
                      subscribed || revealedEmails[row.id] ? (
                        <div className="flex items-center">
                          <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline flex items-center">
                            <EnvelopeSimple className="h-4 w-4 mr-1" />
                            <span className="text-xs">{row.email}</span>
                          </a>
                          {!subscribed && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => toggleEmailVisibility(row.id)}
                              title="Hide email"
                            >
                              <EyeOff className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-gray-400 text-xs blur-sm select-none">
                            {row.email.replace(/./g, "•")}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1"
                            onClick={() => toggleEmailVisibility(row.id)}
                            title="Reveal email (free users get 3 reveals per day)"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    ) : (
                      <span className="text-gray-400 text-xs">Not available</span>
                    )}
                  </TableCell>
                  <TableCell>{getSequenceStatusBadge(row.sequenceStatus)}</TableCell>
                  <TableCell>{getStageBadge(row.stage)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {row.replied ? (
                        <>
                          <Check className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-green-600 text-xs">Yes</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                  <HelpCircle className="h-3 w-3 text-gray-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">
                                  This lead has replied to your outreach. Check your inbox and classify this lead based
                                  on their response.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-600 mr-1" />
                          <span className="text-red-600 text-xs">No</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getClassificationBadge(row.classification)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditLead(row)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Lead Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>Update the information for this lead.</DialogDescription>
          </DialogHeader>
          {editingLead && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editingLead.email || ""}
                  onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sequence-status" className="text-right">
                  Sequence Status
                </Label>
                <Select
                  value={editingLead.sequenceStatus}
                  onValueChange={(value) => setEditingLead({ ...editingLead, sequenceStatus: value })}
                >
                  <SelectTrigger id="sequence-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stage" className="text-right">
                  Stage
                </Label>
                <Select
                  value={editingLead.stage}
                  onValueChange={(value) => setEditingLead({ ...editingLead, stage: value })}
                >
                  <SelectTrigger id="stage" className="col-span-3">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="replied" className="text-right">
                  Replied
                </Label>
                <Select
                  value={editingLead.replied ? "true" : "false"}
                  onValueChange={(value) => setEditingLead({ ...editingLead, replied: value === "true" })}
                >
                  <SelectTrigger id="replied" className="col-span-3">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classification" className="text-right">
                  Classification
                </Label>
                <Select
                  value={editingLead.classification}
                  onValueChange={(value) => setEditingLead({ ...editingLead, classification: value })}
                >
                  <SelectTrigger id="classification" className="col-span-3">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unclassified">Unclassified</SelectItem>
                    <SelectItem value="Hot Lead">Hot Lead</SelectItem>
                    <SelectItem value="Warm Lead">Warm Lead</SelectItem>
                    <SelectItem value="Cold Lead">Cold Lead</SelectItem>
                    <SelectItem value="Not Interested">Not Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
