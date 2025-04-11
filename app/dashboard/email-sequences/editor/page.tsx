"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import SequenceEditor from "@/components/email-sequences/sequence-editor"
import RichTextEditor from "@/components/email-sequences/rich-text-editor"

export default function SequenceEditorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const [sequence, setSequence] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number | null>(null)
  const [emailContent, setEmailContent] = useState<string>("")

  // Load sequence data only once on component mount
  useEffect(() => {
    const loadSequence = () => {
      const sequenceId = searchParams.get("id")
      if (!sequenceId) {
        router.push("/dashboard/email-sequences")
        return
      }

      // Load sequences from localStorage
      const sequencesFromStorage = localStorage.getItem("emailSequences")
      if (sequencesFromStorage) {
        const sequences = JSON.parse(sequencesFromStorage)
        const foundSequence = sequences.find((seq: any) => seq.id === sequenceId)

        if (foundSequence) {
          setSequence(foundSequence)
          setLoading(false)
        } else {
          toast({
            title: "Sequence not found",
            description: "The requested sequence could not be found.",
            variant: "destructive",
          })
          router.push("/dashboard/email-sequences")
        }
      } else {
        toast({
          title: "No sequences found",
          description: "No email sequences were found in your account.",
          variant: "destructive",
        })
        router.push("/dashboard/email-sequences")
      }
    }

    loadSequence()
  }, [searchParams, router, toast])

  // Update email content when selected email changes
  useEffect(() => {
    if (sequence && selectedEmailIndex !== null && sequence.emails?.[selectedEmailIndex]) {
      setEmailContent(sequence.emails[selectedEmailIndex].body)
    } else {
      setEmailContent("")
    }
  }, [sequence, selectedEmailIndex])

  const handleUpdateSequence = (updatedSequence: any) => {
    setSequence(updatedSequence)

    // Update in localStorage
    const sequencesFromStorage = localStorage.getItem("emailSequences")
    if (sequencesFromStorage) {
      const sequences = JSON.parse(sequencesFromStorage)
      const updatedSequences = sequences.map((seq: any) => (seq.id === updatedSequence.id ? updatedSequence : seq))
      localStorage.setItem("emailSequences", JSON.stringify(updatedSequences))
    }

    toast({
      title: "Sequence Updated",
      description: "Your email sequence has been updated successfully.",
    })
  }

  const handleSaveEmailContent = (content: string) => {
    if (selectedEmailIndex === null || !sequence) return

    const updatedEmails = [...sequence.emails]
    updatedEmails[selectedEmailIndex] = {
      ...updatedEmails[selectedEmailIndex],
      body: content,
    }

    const updatedSequence = {
      ...sequence,
      emails: updatedEmails,
    }

    handleUpdateSequence(updatedSequence)
  }

  const handleSaveAndExit = () => {
    toast({
      title: "Sequence Saved",
      description: "Your email sequence has been saved successfully.",
    })
    router.push("/dashboard/email-sequences")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/email-sequences")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{sequence?.name}</h1>
            <p className="text-muted-foreground">{sequence?.description}</p>
          </div>
        </div>
        <Button onClick={handleSaveAndExit}>
          <Save className="mr-2 h-4 w-4" />
          Save & Exit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Email Sequence</CardTitle>
              <CardDescription>Manage the emails in your sequence</CardDescription>
            </CardHeader>
            <CardContent>
              <SequenceEditor
                sequence={sequence}
                onUpdateSequence={handleUpdateSequence}
                onSelectEmail={setSelectedEmailIndex}
                selectedEmailIndex={selectedEmailIndex}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedEmailIndex !== null && sequence?.emails?.[selectedEmailIndex]
                  ? `Edit Email: ${sequence.emails[selectedEmailIndex].subject}`
                  : "Email Editor"}
              </CardTitle>
              <CardDescription>
                {selectedEmailIndex !== null
                  ? `Edit the content of this email in the sequence`
                  : "Select an email from the sequence to edit its content"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEmailIndex !== null && sequence?.emails?.[selectedEmailIndex] ? (
                <RichTextEditor initialContent={emailContent} onSave={handleSaveEmailContent} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">Select an email from the sequence to edit its content</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
