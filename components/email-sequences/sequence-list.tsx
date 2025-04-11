"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Trash2, Edit, Play, Users, Settings, Pause, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import SequenceParametersDialog from "./sequence-parameters-dialog"
import type { CrmLead } from "../crm/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define types for better code readability
interface EmailSequence {
  id: string
  name: string
  description: string
  createdAt: string
  parameters: {
    followUpEmails: number
    intervals: number[]
    haltOnReply: boolean
    sameThread: boolean
  }
  contacts: string[]
  emails: {
    id: string
    subject: string
    body: string
    delay: number
    order: number
  }[]
  stats: {
    leadsAdded: number
    emailsSent: number
    responses: number
    responseRate: number
  }
  status: "draft" | "active" | "paused" | "completed"
}

interface SequenceListProps {
  sequences: EmailSequence[]
  crmLeads: CrmLead[]
  onDeleteSequence: (id: string) => void
  onUpdateSequence: (sequence: EmailSequence) => void
  onChangeStatus: (id: string, status: EmailSequence["status"]) => void
}

/**
 * Component for displaying and managing a list of email sequences
 */
export default function SequenceList({
  sequences,
  crmLeads,
  onDeleteSequence,
  onUpdateSequence,
  onChangeStatus,
}: SequenceListProps) {
  const [sequenceToDelete, setSequenceToDelete] = useState<string | null>(null)
  const [sequenceToEdit, setSequenceToEdit] = useState<EmailSequence | null>(null)
  const [showContactsDialog, setShowContactsDialog] = useState<string | null>(null)
  const [showParametersDialog, setShowParametersDialog] = useState(false)

  /**
   * Formats a date string to a readable format
   * @param dateString ISO date string
   * @returns Formatted date string
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  /**
   * Handles editing sequence parameters
   * @param parameters Updated parameters
   */
  const handleEditParameters = (parameters: any) => {
    if (!sequenceToEdit) return

    const updatedSequence = {
      ...sequenceToEdit,
      name: parameters.name,
      description: parameters.description,
      parameters: {
        followUpEmails: parameters.followUpEmails,
        intervals: parameters.intervals,
        haltOnReply: parameters.haltOnReply,
        sameThread: parameters.sameThread,
      },
    }

    onUpdateSequence(updatedSequence)
    setSequenceToEdit(null)
    setShowParametersDialog(false)
  }

  /**
   * Removes a contact from a sequence
   * @param sequenceId Sequence ID
   * @param contactId Contact ID
   */
  const handleRemoveContact = (sequenceId: string, contactId: string) => {
    const sequence = sequences.find((seq) => seq.id === sequenceId)
    if (!sequence) return

    const updatedContacts = sequence.contacts.filter((id: string) => id !== contactId)
    const updatedSequence = {
      ...sequence,
      contacts: updatedContacts,
    }

    onUpdateSequence(updatedSequence)
  }

  /**
   * Gets contacts for a specific sequence
   * @param sequenceId Sequence ID
   * @returns Array of CRM leads in the sequence
   */
  const getSequenceContacts = (sequenceId: string) => {
    const sequence = sequences.find((seq) => seq.id === sequenceId)
    if (!sequence || !sequence.contacts) return []

    return crmLeads.filter((lead) => sequence.contacts.includes(lead.id))
  }

  /**
   * Renders a status badge for a sequence
   * @param status Sequence status
   * @returns JSX element with appropriate badge
   */
  const renderStatusBadge = (status: EmailSequence["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
            <Play className="h-3 w-3" />
            Active
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
            <Pause className="h-3 w-3" />
            Paused
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Draft
          </Badge>
        )
    }
  }

  /**
   * Renders status action buttons based on current sequence status
   * @param sequence Email sequence
   * @returns JSX element with appropriate action buttons
   */
  const renderStatusActions = (sequence: EmailSequence) => {
    const { id, status } = sequence

    // Don't show status actions for sequences without contacts
    if (sequence.contacts.length === 0) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500"
          disabled
          title="Add contacts to enable sequence actions"
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          No Contacts
        </Button>
      )
    }

    switch (status) {
      case "active":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                <Play className="h-4 w-4 mr-1" />
                Running
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onChangeStatus(id, "paused")}>
                <Pause className="h-4 w-4 mr-2" />
                Pause Sequence
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeStatus(id, "completed")}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      case "paused":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
                <Pause className="h-4 w-4 mr-1" />
                Paused
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onChangeStatus(id, "active")}>
                <Play className="h-4 w-4 mr-2" />
                Resume Sequence
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeStatus(id, "completed")}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      case "completed":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            onClick={() => onChangeStatus(id, "draft")}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </Button>
        )
      default:
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onChangeStatus(id, "active")}
            disabled={sequence.contacts.length === 0}
          >
            <Play className="h-4 w-4 mr-1" />
            Start
          </Button>
        )
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sequences.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No email sequences</h3>
              <p className="text-gray-500 max-w-md">
                Create your first email sequence to start automating your outreach.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        sequences.map((sequence) => {
          const contacts = getSequenceContacts(sequence.id)
          return (
            <Card key={sequence.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{sequence.name}</CardTitle>
                  <div className="flex gap-2">
                    {renderStatusBadge(sequence.status)}
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {sequence.emails?.length || 0} emails
                    </Badge>
                  </div>
                </div>
                <CardDescription>{sequence.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Created</span>
                      <span className="text-sm">{formatDate(sequence.createdAt)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Contacts</span>
                      <span className="text-sm">{contacts.length}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Emails Sent</span>
                      <span className="text-sm">{sequence.stats?.emailsSent || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Response Rate</span>
                      <span className="text-sm">
                        {sequence.stats?.emailsSent
                          ? `${Math.round((sequence.stats.responses / sequence.stats.emailsSent) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>

                  {contacts.length > 0 && (
                    <div className="flex -space-x-2 overflow-hidden">
                      {contacts.slice(0, 5).map((contact: CrmLead) => (
                        <Avatar key={contact.id} className="h-8 w-8 border-2 border-white">
                          <AvatarFallback className="text-xs">
                            {contact.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {contacts.length > 5 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium">
                          +{contacts.length - 5}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setSequenceToDelete(sequence.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                          setSequenceToEdit(sequence)
                          setShowParametersDialog(true)
                        }}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        onClick={() => setShowContactsDialog(sequence.id)}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Contacts
                      </Button>
                      <Link href={`/dashboard/email-sequences/editor?id=${sequence.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      {renderStatusActions(sequence)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!sequenceToDelete} onOpenChange={(open) => !open && setSequenceToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sequence</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sequence? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSequenceToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (sequenceToDelete) {
                  onDeleteSequence(sequenceToDelete)
                  setSequenceToDelete(null)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contacts Dialog */}
      <Dialog open={!!showContactsDialog} onOpenChange={(open) => !open && setShowContactsDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sequence Contacts</DialogTitle>
            <DialogDescription>Manage the contacts in this email sequence.</DialogDescription>
          </DialogHeader>
          {showContactsDialog && (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {getSequenceContacts(showContactsDialog).length === 0 ? (
                  <p className="text-center text-sm text-gray-500 py-4">
                    No contacts in this sequence yet. Add contacts from the CRM.
                  </p>
                ) : (
                  getSequenceContacts(showContactsDialog).map((contact: CrmLead) => (
                    <div key={contact.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{contact.name}</p>
                          <p className="text-xs text-gray-500">{contact.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleRemoveContact(showContactsDialog, contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button onClick={() => setShowContactsDialog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Parameters Dialog */}
      {sequenceToEdit && (
        <SequenceParametersDialog
          open={showParametersDialog}
          onOpenChange={setShowParametersDialog}
          onSubmit={handleEditParameters}
          existingParameters={{
            name: sequenceToEdit.name,
            description: sequenceToEdit.description,
            followUpEmails: sequenceToEdit.parameters?.followUpEmails || 3,
            intervals: sequenceToEdit.parameters?.intervals || [3, 5, 7],
            haltOnReply: sequenceToEdit.parameters?.haltOnReply,
            sameThread: sequenceToEdit.parameters?.sameThread,
          }}
          isEditing={true}
        />
      )}
    </div>
  )
}
