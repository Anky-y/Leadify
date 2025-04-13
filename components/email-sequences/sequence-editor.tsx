"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, MoveUp, MoveDown, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Email {
  id: string
  subject: string
  body: string
  delay: number
  order: number
}

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
  emails: Email[]
  stats: {
    leadsAdded: number
    emailsSent: number
    responses: number
    responseRate: number
  }
  status: "draft" | "active" | "paused" | "completed"
}

interface SequenceEditorProps {
  sequence: EmailSequence
  onUpdateSequence: (sequence: EmailSequence) => void
  onSelectEmail: (index: number | null) => void
  selectedEmailIndex: number | null
}

/**
 * Component for editing email sequences
 * Allows adding, removing, and reordering emails in a sequence
 */
export default function SequenceEditor({
  sequence,
  onUpdateSequence,
  onSelectEmail,
  selectedEmailIndex,
}: SequenceEditorProps) {
  const [showAddEmailDialog, setShowAddEmailDialog] = useState(false)
  const [newEmailSubject, setNewEmailSubject] = useState("")
  const [newEmailDelay, setNewEmailDelay] = useState(3)

  const { toast } = useToast()

  /**
   * Adds a new email to the sequence
   */
  const handleAddEmail = () => {
    if (!newEmailSubject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject for your email.",
        variant: "destructive",
      })
      return
    }

    const newEmail: Email = {
      id: Date.now().toString(),
      subject: newEmailSubject,
      body: "<p>Write your email content here...</p>",
      delay: newEmailDelay,
      order: (sequence.emails?.length || 0) + 1,
    }

    const updatedEmails = [...(sequence.emails || []), newEmail]

    onUpdateSequence({
      ...sequence,
      emails: updatedEmails,
    })

    setShowAddEmailDialog(false)
    setNewEmailSubject("")
    setNewEmailDelay(3)

    toast({
      title: "Email Added",
      description: "Your email has been added to the sequence.",
    })

    // Select the newly added email
    onSelectEmail(updatedEmails.length - 1)
  }

  /**
   * Deletes an email from the sequence
   * @param index Index of the email to delete
   */
  const handleDeleteEmail = (index: number) => {
    const updatedEmails = [...sequence.emails]
    updatedEmails.splice(index, 1)

    // Update order for remaining emails
    updatedEmails.forEach((email, i) => {
      email.order = i + 1
    })

    onUpdateSequence({
      ...sequence,
      emails: updatedEmails,
    })

    // If the deleted email was selected, deselect it
    if (selectedEmailIndex === index) {
      onSelectEmail(null)
    } else if (selectedEmailIndex !== null && selectedEmailIndex > index) {
      // If the selected email was after the deleted one, adjust the index
      onSelectEmail(selectedEmailIndex - 1)
    }

    toast({
      title: "Email Deleted",
      description: "Your email has been removed from the sequence.",
    })
  }

  /**
   * Moves an email up or down in the sequence
   * @param index Index of the email to move
   * @param direction Direction to move the email ("up" or "down")
   */
  const handleMoveEmail = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === sequence.emails.length - 1)) {
      return
    }

    const updatedEmails = [...sequence.emails]
    const newIndex = direction === "up" ? index - 1 : index + 1

    // Swap emails
    const temp = updatedEmails[index]
    updatedEmails[index] = updatedEmails[newIndex]
    updatedEmails[newIndex] = temp

    // Update order
    updatedEmails.forEach((email, i) => {
      email.order = i + 1
    })

    onUpdateSequence({
      ...sequence,
      emails: updatedEmails,
    })

    // Update selected email index if it was one of the moved emails
    if (selectedEmailIndex === index) {
      onSelectEmail(newIndex)
    } else if (selectedEmailIndex === newIndex) {
      onSelectEmail(index)
    }
  }

  /**
   * Updates the subject of an email
   * @param index Index of the email to update
   * @param subject New subject
   */
  const handleUpdateEmailSubject = (index: number, subject: string) => {
    const updatedEmails = [...sequence.emails]
    updatedEmails[index] = {
      ...updatedEmails[index],
      subject,
    }

    onUpdateSequence({
      ...sequence,
      emails: updatedEmails,
    })
  }

  /**
   * Updates the delay of an email
   * @param index Index of the email to update
   * @param delay New delay in days
   */
  const handleUpdateEmailDelay = (index: number, delay: number) => {
    const updatedEmails = [...sequence.emails]
    updatedEmails[index] = {
      ...updatedEmails[index],
      delay,
    }

    onUpdateSequence({
      ...sequence,
      emails: updatedEmails,
    })
  }

  // Show warning if sequence is active
  const isSequenceActive = sequence.status === "active"

  return (
    <div className="space-y-4">
      {isSequenceActive && (
        <Alert variant="default" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Sequence is active</AlertTitle>
          <AlertDescription>
            This sequence is currently active and sending emails. Changes you make will affect future emails in the
            sequence.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Emails in Sequence</h3>
        <Button size="sm" onClick={() => setShowAddEmailDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Email
        </Button>
      </div>

      {sequence.emails?.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500 text-sm">No emails in this sequence yet. Add your first email to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sequence.emails?.map((email: Email, index: number) => (
            <div
              key={email.id}
              className={cn(
                "border rounded-md p-3 cursor-pointer transition-colors",
                selectedEmailIndex === index ? "border-blue-500 bg-blue-50" : "hover:border-gray-300",
              )}
              onClick={() => onSelectEmail(index)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {index === 0 ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 mb-1">
                        Initial Email
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 mb-1">
                        Follow-up {index}
                      </Badge>
                    )}
                    {selectedEmailIndex === index ? (
                      <Input
                        value={email.subject}
                        onChange={(e) => handleUpdateEmailSubject(index, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                    ) : (
                      <div>{email.subject}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    {index === 0 ? (
                      "Sent immediately"
                    ) : selectedEmailIndex === index ? (
                      <div className="flex items-center gap-2">
                        <span>Sent</span>
                        <Input
                          type="number"
                          min="1"
                          value={email.delay}
                          onChange={(e) => handleUpdateEmailDelay(index, Number.parseInt(e.target.value) || 1)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 h-6 text-xs py-0"
                        />
                        <span>days after previous email</span>
                      </div>
                    ) : (
                      `Sent ${email.delay} day${email.delay !== 1 ? "s" : ""} after previous email`
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveEmail(index, "up")
                    }}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveEmail(index, "down")
                    }}
                    disabled={index === sequence.emails.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteEmail(index)
                    }}
                    disabled={sequence.emails.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Email Dialog */}
      <Dialog open={showAddEmailDialog} onOpenChange={setShowAddEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Email to Sequence</DialogTitle>
            <DialogDescription>
              Create a new email for your sequence. You can edit the content after adding it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={newEmailSubject}
                onChange={(e) => setNewEmailSubject(e.target.value)}
                placeholder="e.g., Introduction and Collaboration Opportunity"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-delay">Delay (days)</Label>
              <Input
                id="email-delay"
                type="number"
                min="0"
                value={newEmailDelay}
                onChange={(e) => setNewEmailDelay(Number.parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500">
                Number of days to wait after the previous email before sending this one.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmail}>Add Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
