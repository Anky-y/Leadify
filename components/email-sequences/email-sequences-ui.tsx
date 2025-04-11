"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, UploadCloud } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import SequenceList from "./sequence-list"
import SequenceParametersDialog from "./sequence-parameters-dialog"
import { useRouter } from "next/navigation"
import type { CrmLead } from "../crm/types"

// Define types for better code readability and type safety
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

interface EmailSequencesUIProps {
  initialSubscribed?: boolean
}

/**
 * Main component for managing email sequences
 * Handles creating, updating, and deleting sequences
 */
export default function EmailSequencesUI({ initialSubscribed = false }: EmailSequencesUIProps) {
  const [sequences, setSequences] = useState<EmailSequence[]>([])
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showParametersDialog, setShowParametersDialog] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [crmLeads, setCrmLeads] = useState<CrmLead[]>([])
  const router = useRouter()
  const { toast } = useToast()

  // Load sequences and CRM leads from localStorage on component mount
  useEffect(() => {
    // Load sequences from localStorage
    const loadSequences = () => {
      const sequencesFromStorage = localStorage.getItem("emailSequences")
      if (sequencesFromStorage) {
        const parsedSequences = JSON.parse(sequencesFromStorage)
        // Ensure all sequences have a status field
        const updatedSequences = parsedSequences.map((seq: any) => ({
          ...seq,
          status: seq.status || "draft",
        }))
        setSequences(updatedSequences)
      } else {
        // Add default sequence if none exist
        const defaultSequence = createDefaultSequence()
        setSequences([defaultSequence])
        localStorage.setItem("emailSequences", JSON.stringify([defaultSequence]))
      }
    }

    // Load CRM leads from localStorage
    const loadLeads = () => {
      const leadsFromStorage = localStorage.getItem("crmLeads")
      if (leadsFromStorage) {
        setCrmLeads(JSON.parse(leadsFromStorage))
      }
    }

    loadSequences()
    loadLeads()
  }, [])

  // Save sequences to localStorage when they change
  useEffect(() => {
    if (sequences.length > 0) {
      localStorage.setItem("emailSequences", JSON.stringify(sequences))
    }
  }, [sequences])

  /**
   * Creates a default email sequence template
   * @returns A default email sequence object
   */
  const createDefaultSequence = (): EmailSequence => {
    return {
      id: "default",
      name: "Default Outreach Sequence",
      description: "A standard 4-email outreach sequence for new leads.",
      createdAt: new Date().toISOString(),
      parameters: {
        followUpEmails: 3,
        intervals: [3, 5, 7],
        haltOnReply: true,
        sameThread: true,
      },
      contacts: [],
      emails: [
        {
          id: "email1",
          subject: "Introduction and Collaboration Opportunity",
          body: "<p>Hi {{name}},</p><p>I came across your {{platform}} channel and was impressed by your content, especially in the {{category}} niche.</p><p>I'd love to discuss a potential collaboration opportunity that I think would be a great fit for your audience of {{followers}} followers.</p><p>Would you be open to a quick chat about how we might work together?</p><p>Best regards,<br>Your Name</p>",
          delay: 0,
          order: 1,
        },
        {
          id: "email2",
          subject: "Following up on collaboration opportunity",
          body: "<p>Hi {{name}},</p><p>I wanted to follow up on my previous email about a potential collaboration for your {{platform}} channel.</p><p>I understand you're busy creating great content, but I believe this opportunity could be valuable for both of us.</p><p>Let me know if you're interested in discussing further.</p><p>Best regards,<br>Your Name</p>",
          delay: 3,
          order: 2,
        },
        {
          id: "email3",
          subject: "One last thought about our collaboration",
          body: "<p>Hi {{name}},</p><p>I just wanted to send one final note about the collaboration opportunity I mentioned.</p><p>Given your focus on {{category}} content and your engagement levels, I think your audience would really respond well to what we're offering.</p><p>If you're interested, just reply to this email and we can set up a time to chat.</p><p>Best regards,<br>Your Name</p>",
          delay: 5,
          order: 3,
        },
      ],
      stats: {
        leadsAdded: 0,
        emailsSent: 0,
        responses: 0,
        responseRate: 0,
      },
      status: "draft",
    }
  }

  /**
   * Handles creating a new email sequence
   * @param parameters The parameters for the new sequence
   */
  const handleCreateSequence = (parameters: any) => {
    // Create a new sequence with the provided parameters
    const newSequence: EmailSequence = {
      id: Date.now().toString(),
      name: parameters.name,
      description: parameters.description,
      createdAt: new Date().toISOString(),
      parameters: {
        followUpEmails: parameters.followUpEmails,
        intervals: Array.from({ length: parameters.followUpEmails }, (_, i) => parameters.intervals[i] || 3),
        haltOnReply: parameters.haltOnReply,
        sameThread: parameters.sameThread,
      },
      contacts: [],
      emails: [
        {
          id: `email-${Date.now()}-1`,
          subject: "Initial Outreach",
          body: "<p>Hi {{name}},</p><p>Write your initial email here...</p>",
          delay: 0,
          order: 1,
        },
      ],
      stats: {
        leadsAdded: 0,
        emailsSent: 0,
        responses: 0,
        responseRate: 0,
      },
      status: "draft",
    }

    // Add the new sequence to the list
    const updatedSequences = [...sequences, newSequence]
    setSequences(updatedSequences)

    // Close the dialog
    setShowParametersDialog(false)

    // Show success toast
    toast({
      title: "Sequence Created",
      description: `Your sequence "${parameters.name}" has been created.`,
    })

    // Redirect to the sequence editor
    router.push(`/dashboard/email-sequences/editor?id=${newSequence.id}`)
  }

  /**
   * Handles uploading leads from a file
   * In a real app, this would parse the file and add the leads
   */
  const handleUploadLeads = () => {
    if (!uploadFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    // For demo purposes, we'll just simulate it with some mock data
    const newLeads = [
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
    const existingLeads = JSON.parse(localStorage.getItem("crmLeads") || "[]")
    const updatedLeads = [...existingLeads, ...newLeads]
    localStorage.setItem("crmLeads", JSON.stringify(updatedLeads))
    setCrmLeads(updatedLeads)

    setShowUploadDialog(false)
    setUploadFile(null)

    toast({
      title: "Leads Uploaded",
      description: `${newLeads.length} leads have been added to your CRM.`,
    })
  }

  /**
   * Handles deleting a sequence
   * @param id The ID of the sequence to delete
   */
  const handleDeleteSequence = (id: string) => {
    const updatedSequences = sequences.filter((seq) => seq.id !== id)
    setSequences(updatedSequences)

    toast({
      title: "Sequence Deleted",
      description: "Your sequence has been deleted.",
    })
  }

  /**
   * Handles updating a sequence
   * @param updatedSequence The updated sequence object
   */
  const handleUpdateSequence = (updatedSequence: EmailSequence) => {
    const updatedSequences = sequences.map((seq) => (seq.id === updatedSequence.id ? updatedSequence : seq))
    setSequences(updatedSequences)

    toast({
      title: "Sequence Updated",
      description: `Your sequence "${updatedSequence.name}" has been updated.`,
    })
  }

  /**
   * Handles changing the status of a sequence
   * @param id The ID of the sequence
   * @param status The new status
   */
  const handleChangeSequenceStatus = (id: string, status: EmailSequence["status"]) => {
    const updatedSequences = sequences.map((seq) => {
      if (seq.id === id) {
        return { ...seq, status }
      }
      return seq
    })

    setSequences(updatedSequences)

    const statusMessages = {
      active: "Sequence activated. Emails will be sent according to schedule.",
      paused: "Sequence paused. No emails will be sent until resumed.",
      completed: "Sequence marked as completed.",
      draft: "Sequence returned to draft status.",
    }

    toast({
      title: `Sequence ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: statusMessages[status],
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Sequences</h1>
        <p className="text-muted-foreground">Create and manage email sequences for your leads.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            {sequences.length} {sequences.length === 1 ? "sequence" : "sequences"} available
          </p>
        </div>

        <div className="flex gap-2">
          <SequenceParametersDialog
            open={showParametersDialog}
            onOpenChange={setShowParametersDialog}
            onSubmit={handleCreateSequence}
          />

          <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => setShowParametersDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Sequence
          </Button>

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
                <Button onClick={handleUploadLeads}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SequenceList
        sequences={sequences}
        crmLeads={crmLeads}
        onDeleteSequence={handleDeleteSequence}
        onUpdateSequence={handleUpdateSequence}
        onChangeStatus={handleChangeSequenceStatus}
      />
    </div>
  )
}
