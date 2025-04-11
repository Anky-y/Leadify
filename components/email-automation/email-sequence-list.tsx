"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Trash2, Edit, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

interface EmailSequenceListProps {
  sequences: any[]
  onSelectSequence: (sequence: any) => void
  onDeleteSequence: (id: string) => void
}

export default function EmailSequenceList({ sequences, onSelectSequence, onDeleteSequence }: EmailSequenceListProps) {
  const [sequenceToDelete, setSequenceToDelete] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
        sequences.map((sequence) => (
          <Card key={sequence.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{sequence.name}</CardTitle>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {sequence.emails?.length || 0} emails
                </Badge>
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
                    <span className="text-xs text-gray-500">Leads</span>
                    <span className="text-sm">{sequence.stats?.leadsAdded || 0}</span>
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
                      onClick={() => onSelectSequence(sequence)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

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
    </div>
  )
}
