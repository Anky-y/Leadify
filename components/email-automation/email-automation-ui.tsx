"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Settings, Mail, Clock, Users, UploadCloud } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Textarea } from "@/components/ui/textarea"
import EmailSequenceList from "./email-sequence-list"
import EmailEditor from "./email-editor"

interface EmailAutomationUIProps {
  initialSubscribed?: boolean
}

export default function EmailAutomationUI({ initialSubscribed = false }: EmailAutomationUIProps) {
  const [activeTab, setActiveTab] = useState("sequences")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [sequenceName, setSequenceName] = useState("")
  const [sequenceDescription, setSequenceDescription] = useState("")
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [sequences, setSequences] = useState<any[]>([])
  const [selectedSequence, setSelectedSequence] = useState<any | null>(null)

  const { toast } = useToast()

  // Load sequences from localStorage on component mount
  useEffect(() => {
    const sequencesFromStorage = localStorage.getItem("emailSequences")
    if (sequencesFromStorage) {
      setSequences(JSON.parse(sequencesFromStorage))
    } else {
      // Add default sequence if none exist
      const defaultSequence = {
        id: "default",
        name: "Default Outreach Sequence",
        description: "A standard 4-email outreach sequence for new leads.",
        createdAt: new Date().toISOString(),
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
      }
      setSequences([defaultSequence])
      localStorage.setItem("emailSequences", JSON.stringify([defaultSequence]))
    }
  }, [])

  // Save sequences to localStorage when they change
  useEffect(() => {
    if (sequences.length > 0) {
      localStorage.setItem("emailSequences", JSON.stringify(sequences))
    }
  }, [sequences])

  const handleCreateSequence = () => {
    if (!sequenceName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your sequence.",
        variant: "destructive",
      })
      return
    }

    const newSequence = {
      id: Date.now().toString(),
      name: sequenceName,
      description: sequenceDescription,
      createdAt: new Date().toISOString(),
      emails: [],
      stats: {
        leadsAdded: 0,
        emailsSent: 0,
        responses: 0,
        responseRate: 0,
      },
    }

    setSequences([...sequences, newSequence])
    setShowCreateDialog(false)
    setSequenceName("")
    setSequenceDescription("")

    toast({
      title: "Sequence Created",
      description: `Your sequence "${sequenceName}" has been created.`,
    })
  }

  const handleUploadLeads = () => {
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

    setShowUploadDialog(false)
    setUploadFile(null)

    toast({
      title: "Leads Uploaded",
      description: `${newLeads.length} leads have been added to your CRM.`,
    })
  }

  const handleSelectSequence = (sequence: any) => {
    setSelectedSequence(sequence)
    setActiveTab("editor")
  }

  const handleUpdateSequence = (updatedSequence: any) => {
    const updatedSequences = sequences.map((seq) => (seq.id === updatedSequence.id ? updatedSequence : seq))

    setSequences(updatedSequences)
    setSelectedSequence(updatedSequence)

    toast({
      title: "Sequence Updated",
      description: `Your sequence "${updatedSequence.name}" has been updated.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Automation</h1>
        <p className="text-muted-foreground">Create and manage email sequences for your leads.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="sequences">
                <Mail className="mr-2 h-4 w-4" />
                Sequences
              </TabsTrigger>
              <TabsTrigger value="editor" disabled={!selectedSequence}>
                <Settings className="mr-2 h-4 w-4" />
                Sequence Editor
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <Clock className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sequences" className="mt-4">
              <EmailSequenceList
                sequences={sequences}
                onSelectSequence={handleSelectSequence}
                onDeleteSequence={(id) => {
                  setSequences(sequences.filter((seq) => seq.id !== id))
                  toast({
                    title: "Sequence Deleted",
                    description: "Your sequence has been deleted.",
                  })
                }}
              />
            </TabsContent>

            <TabsContent value="editor" className="mt-4">
              {selectedSequence && <EmailEditor sequence={selectedSequence} onUpdateSequence={handleUpdateSequence} />}
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Sequence Analytics</CardTitle>
                  <CardDescription>Track the performance of your email sequences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sequences</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{sequences.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {sequences.reduce((total, seq) => total + (seq.stats?.leadsAdded || 0), 0)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {sequences.reduce((total, seq) => total + (seq.stats?.emailsSent || 0), 0)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {sequences.length > 0
                            ? `${Math.round(
                                (sequences.reduce((total, seq) => total + (seq.stats?.responses || 0), 0) /
                                  Math.max(
                                    sequences.reduce((total, seq) => total + (seq.stats?.emailsSent || 0), 0),
                                    1,
                                  )) *
                                  100,
                              )}%`
                            : "0%"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-700 hover:bg-blue-800">
                <Plus className="mr-2 h-4 w-4" />
                New Sequence
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Email Sequence</DialogTitle>
                <DialogDescription>Create a new email sequence for your leads.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sequence-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="sequence-name"
                    value={sequenceName}
                    onChange={(e) => setSequenceName(e.target.value)}
                    placeholder="e.g., Outreach Sequence"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sequence-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="sequence-description"
                    value={sequenceDescription}
                    onChange={(e) => setSequenceDescription(e.target.value)}
                    placeholder="Describe the purpose of this sequence"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSequence}>Create Sequence</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
    </div>
  )
}
