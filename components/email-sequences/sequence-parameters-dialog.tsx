"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SequenceParameters {
  name: string
  description: string
  followUpEmails: number
  intervals: number[]
  haltOnReply: boolean
  sameThread: boolean
}

interface SequenceParametersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (parameters: SequenceParameters) => void
  existingParameters?: Partial<SequenceParameters>
  isEditing?: boolean
}

/**
 * Dialog for creating or editing email sequence parameters
 */
export default function SequenceParametersDialog({
  open,
  onOpenChange,
  onSubmit,
  existingParameters,
  isEditing = false,
}: SequenceParametersDialogProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [name, setName] = useState(existingParameters?.name || "")
  const [description, setDescription] = useState(existingParameters?.description || "")
  const [followUpEmails, setFollowUpEmails] = useState(existingParameters?.followUpEmails || 3)
  const [intervals, setIntervals] = useState<number[]>(existingParameters?.intervals || [3, 5, 7, 10, 14])
  const [haltOnReply, setHaltOnReply] = useState(
    existingParameters?.haltOnReply !== undefined ? existingParameters.haltOnReply : true,
  )
  const [sameThread, setSameThread] = useState(
    existingParameters?.sameThread !== undefined ? existingParameters.sameThread : true,
  )

  const { toast } = useToast()

  // Reset form when dialog opens with new parameters
  useEffect(() => {
    if (open && existingParameters) {
      setName(existingParameters.name || "")
      setDescription(existingParameters.description || "")
      setFollowUpEmails(existingParameters.followUpEmails || 3)
      setIntervals(existingParameters.intervals || [3, 5, 7, 10, 14])
      setHaltOnReply(existingParameters.haltOnReply !== undefined ? existingParameters.haltOnReply : true)
      setSameThread(existingParameters.sameThread !== undefined ? existingParameters.sameThread : true)
    }
  }, [open, existingParameters])

  /**
   * Validates and submits the form
   */
  const handleSubmit = () => {
    // Validate form
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your sequence.",
        variant: "destructive",
      })
      return
    }

    if (followUpEmails < 0 || followUpEmails > 10) {
      toast({
        title: "Error",
        description: "Follow-up emails must be between 0 and 10.",
        variant: "destructive",
      })
      return
    }

    // Submit form
    onSubmit({
      name,
      description,
      followUpEmails,
      intervals,
      haltOnReply,
      sameThread,
    })

    // Reset form if not editing
    if (!isEditing) {
      setName("")
      setDescription("")
      setFollowUpEmails(3)
      setIntervals([3, 5, 7, 10, 14])
      setHaltOnReply(true)
      setSameThread(true)
    }
  }

  /**
   * Updates an interval value at a specific index
   * @param index Index of the interval to update
   * @param value New interval value
   */
  const handleIntervalChange = (index: number, value: string) => {
    const newIntervals = [...intervals]
    newIntervals[index] = Number.parseInt(value) || 0
    setIntervals(newIntervals)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Sequence Parameters" : "Create Email Sequence"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the parameters for your email sequence."
              : "Set up the parameters for your new email sequence."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label htmlFor="sequence-name">Sequence Name</Label>
              <Input
                id="sequence-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Outreach Sequence"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sequence-description">Description</Label>
              <Textarea
                id="sequence-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this sequence"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="follow-up-emails">Number of Follow-up Emails</Label>
              <Input
                id="follow-up-emails"
                type="number"
                min="0"
                max="10"
                value={followUpEmails}
                onChange={(e) => setFollowUpEmails(Number.parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                How many follow-up emails to send after the initial email (0-10).
              </p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label>Time Intervals (days)</Label>
              <div className="grid gap-2">
                {Array.from({ length: Math.min(followUpEmails, 5) }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Label htmlFor={`interval-${index}`} className="w-32">
                      Follow-up {index + 1}:
                    </Label>
                    <Input
                      id={`interval-${index}`}
                      type="number"
                      min="1"
                      value={intervals[index] || 3}
                      onChange={(e) => handleIntervalChange(index, e.target.value)}
                      className="w-20"
                    />
                    <span className="text-sm">days after previous</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="halt-on-reply" className="cursor-pointer">
                Halt sequence on reply
              </Label>
              <Switch id="halt-on-reply" checked={haltOnReply} onCheckedChange={setHaltOnReply} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="same-thread" className="cursor-pointer">
                Continue in same email thread
              </Label>
              <Switch id="same-thread" checked={sameThread} onCheckedChange={setSameThread} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEditing ? "Update Parameters" : "Create Sequence"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
