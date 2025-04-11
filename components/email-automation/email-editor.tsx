"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, MoveUp, MoveDown, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface EmailEditorProps {
  sequence: any
  onUpdateSequence: (sequence: any) => void
}

export default function EmailEditor({ sequence, onUpdateSequence }: EmailEditorProps) {
  const [editedSequence, setEditedSequence] = useState({ ...sequence })
  const [showAddEmailDialog, setShowAddEmailDialog] = useState(false)
  const [newEmailSubject, setNewEmailSubject] = useState("")
  const [newEmailBody, setNewEmailBody] = useState("")
  const [newEmailDelay, setNewEmailDelay] = useState(3)
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number | null>(null)
  const [previewEmail, setPreviewEmail] = useState<any | null>(null)
  const [previewTab, setPreviewTab] = useState("edit")

  const { toast } = useToast()

  const handleAddEmail = () => {
    if (!newEmailSubject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject for your email.",
        variant: "destructive",
      })
      return
    }

    if (!newEmailBody.trim()) {
      toast({
        title: "Error",
        description: "Please enter a body for your email.",
        variant: "destructive",
      })
      return
    }

    const newEmail = {
      id: Date.now().toString(),
      subject: newEmailSubject,
      body: newEmailBody,
      delay: newEmailDelay,
      order: (editedSequence.emails?.length || 0) + 1,
    }

    const updatedEmails = [...(editedSequence.emails || []), newEmail]

    setEditedSequence({
      ...editedSequence,
      emails: updatedEmails,
    })

    setShowAddEmailDialog(false)
    setNewEmailSubject("")
    setNewEmailBody("")
    setNewEmailDelay(3)

    toast({
      title: "Email Added",
      description: "Your email has been added to the sequence.",
    })
  }

  const handleDeleteEmail = (index: number) => {
    const updatedEmails = [...editedSequence.emails]
    updatedEmails.splice(index, 1)

    // Update order for remaining emails
    updatedEmails.forEach((email, i) => {
      email.order = i + 1
    })

    setEditedSequence({
      ...editedSequence,
      emails: updatedEmails,
    })

    toast({
      title: "Email Deleted",
      description: "Your email has been removed from the sequence.",
    })
  }

  const handleMoveEmail = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === editedSequence.emails.length - 1)) {
      return
    }

    const updatedEmails = [...editedSequence.emails]
    const newIndex = direction === "up" ? index - 1 : index + 1

    // Swap emails
    ;[updatedEmails[index], updatedEmails[newIndex]] = [updatedEmails[newIndex], updatedEmails[index]]

    // Update order
    updatedEmails.forEach((email, i) => {
      email.order = i + 1
    })

    setEditedSequence({
      ...editedSequence,
      emails: updatedEmails,
    })
  }

  const handleUpdateSequence = () => {
    onUpdateSequence(editedSequence)
  }

  const handleEditEmail = (index: number) => {
    setSelectedEmailIndex(index)
    setPreviewEmail(editedSequence.emails[index])
    setPreviewTab("edit")
  }

  const handlePreviewEmail = (index: number) => {
    setSelectedEmailIndex(index)
    setPreviewEmail(editedSequence.emails[index])
    setPreviewTab("preview")
  }

  const handleUpdateEmail = () => {
    if (selectedEmailIndex === null || !previewEmail) return

    const updatedEmails = [...editedSequence.emails]
    updatedEmails[selectedEmailIndex] = previewEmail

    setEditedSequence({
      ...editedSequence,
      emails: updatedEmails,
    })

    setSelectedEmailIndex(null)
    setPreviewEmail(null)

    toast({
      title: "Email Updated",
      description: "Your email has been updated.",
    })
  }

  // Replace variables in the email body with sample values
  const getPreviewHtml = (body: string) => {
    const platform = "YouTube"
    const category = "Tech"
    const followers = "50,000"
    return body
      .replace(/{{name}}/g, "John Doe")
      .replace(/{{platform}}/g, platform)
      .replace(/{{category}}/g, category)
      .replace(/{{followers}}/g, followers)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{editedSequence.name}</CardTitle>
              <CardDescription>{editedSequence.description}</CardDescription>
            </div>
            <Button onClick={handleUpdateSequence}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Emails in Sequence</h3>
              <Dialog open={showAddEmailDialog} onOpenChange={setShowAddEmailDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add Email to Sequence</DialogTitle>
                    <DialogDescription>
                      Create a new email for your sequence. Use {{ name }}, {{ platform }}, {{ category }}, and{" "}
                      {{ followers }} as variables.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email-subject" className="text-right">
                        Subject
                      </Label>
                      <Input
                        id="email-subject"
                        value={newEmailSubject}
                        onChange={(e) => setNewEmailSubject(e.target.value)}
                        placeholder="e.g., Introduction and Collaboration Opportunity"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email-delay" className="text-right">
                        Delay (days)
                      </Label>
                      <Input
                        id="email-delay"
                        type="number"
                        min="0"
                        value={newEmailDelay}
                        onChange={(e) => setNewEmailDelay(Number.parseInt(e.target.value))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="email-body" className="text-right pt-2">
                        Body
                      </Label>
                      <div className="col-span-3">
                        <textarea
                          id="email-body"
                          value={newEmailBody}
                          onChange={(e) => setNewEmailBody(e.target.value)}
                          placeholder="Enter your email content here..."
                          className="w-full h-64 p-2 border rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use HTML for formatting. Available variables: {{ name }}, {{ platform }}, {{ category }},{" "}
                          {{ followers }}
                        </p>
                      </div>
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

            {editedSequence.emails?.length === 0 ? (
              <div className="text-center py-8 border rounded-md bg-gray-50">
                <p className="text-gray-500">No emails in this sequence yet. Add your first email to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {editedSequence.emails?.map((email: any, index: number) => (
                  <Card key={email.id} className="border-blue-100">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {index + 1}. {email.subject}
                          </CardTitle>
                          <CardDescription>
                            {email.delay === 0
                              ? "Sent immediately"
                              : `Sent ${email.delay} day${email.delay !== 1 ? "s" : ""} after previous email`}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMoveEmail(index, "up")}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMoveEmail(index, "down")}
                            disabled={index === editedSequence.emails.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDeleteEmail(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={() => handlePreviewEmail(index)}>
                          Preview
                        </Button>
                        <Button size="sm" onClick={() => handleEditEmail(index)}>
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Preview/Edit Dialog */}
      <Dialog open={selectedEmailIndex !== null} onOpenChange={(open) => !open && setSelectedEmailIndex(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewTab === "edit" ? "Edit Email" : "Preview Email"}</DialogTitle>
            <DialogDescription>
              {previewTab === "edit"
                ? "Edit your email content. Use variables like {{name}} to personalize."
                : "This is how your email will look when sent to leads."}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={previewTab} onValueChange={setPreviewTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              {previewEmail && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-subject" className="text-right">
                      Subject
                    </Label>
                    <Input
                      id="edit-subject"
                      value={previewEmail.subject}
                      onChange={(e) => setPreviewEmail({ ...previewEmail, subject: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-delay" className="text-right">
                      Delay (days)
                    </Label>
                    <Input
                      id="edit-delay"
                      type="number"
                      min="0"
                      value={previewEmail.delay}
                      onChange={(e) => setPreviewEmail({ ...previewEmail, delay: Number.parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="edit-body" className="text-right pt-2">
                      Body
                    </Label>
                    <div className="col-span-3">
                      <textarea
                        id="edit-body"
                        value={previewEmail.body}
                        onChange={(e) => setPreviewEmail({ ...previewEmail, body: e.target.value })}
                        className="w-full h-64 p-2 border rounded-md"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use HTML for formatting. Available variables: {{ name }}, {{ platform }}, {{ category }},{" "}
                        {{ followers }}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview">
              {previewEmail && (
                <div className="border rounded-md p-4 space-y-4">
                  <div className="border-b pb-2">
                    <div className="font-medium">Subject: {previewEmail.subject}</div>
                    <div className="text-sm text-gray-500">
                      Sent{" "}
                      {previewEmail.delay === 0
                        ? "immediately"
                        : `${previewEmail.delay} day${previewEmail.delay !== 1 ? "s" : ""} after previous email`}
                    </div>
                  </div>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: getPreviewHtml(previewEmail.body) }}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEmailIndex(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEmail}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
