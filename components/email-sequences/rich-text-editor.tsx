"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Code,
  Save,
  Eye,
  Edit,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RichTextEditorProps {
  initialContent: string
  onSave: (content: string) => void
}

/**
 * Rich text editor component for composing email content
 * Supports formatting, variables, and preview
 */
export default function RichTextEditor({ initialContent, onSave }: RichTextEditorProps) {
  // Initialize content state only once with initialContent
  const [content, setContent] = useState(initialContent || "")
  const [activeTab, setActiveTab] = useState("edit")
  const [showLinkPopover, setShowLinkPopover] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [showVariablePopover, setShowVariablePopover] = useState(false)

  // Use a ref to track if we've already initialized from props
  const initializedRef = useRef(false)
  // Store the previous initialContent to compare
  const prevInitialContentRef = useRef(initialContent)

  const { toast } = useToast()

  // Only update content when initialContent changes and is different from previous
  useEffect(() => {
    // Skip the first render if we already initialized with the prop value
    if (!initializedRef.current) {
      initializedRef.current = true
      return
    }

    // Only update if initialContent has changed
    if (initialContent !== prevInitialContentRef.current) {
      prevInitialContentRef.current = initialContent
      setContent(initialContent || "")
    }
  }, [initialContent])

  /**
   * Saves the email content
   */
  const handleSave = () => {
    onSave(content)
    toast({
      title: "Email Saved",
      description: "Your email content has been saved.",
    })
  }

  /**
   * Applies formatting to selected text
   * @param format The format to apply (bold, italic, etc.)
   */
  const formatText = (format: string) => {
    const textarea = document.getElementById("editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let formattedText = ""
    let cursorPosition = 0

    switch (format) {
      case "bold":
        formattedText = `<strong>${selectedText}</strong>`
        cursorPosition = start + 8 + selectedText.length
        break
      case "italic":
        formattedText = `<em>${selectedText}</em>`
        cursorPosition = start + 4 + selectedText.length
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        cursorPosition = start + 3 + selectedText.length
        break
      case "ul":
        formattedText = `<ul>\n  <li>${selectedText}</li>\n</ul>`
        cursorPosition = start + 13 + selectedText.length
        break
      case "ol":
        formattedText = `<ol>\n  <li>${selectedText}</li>\n</ol>`
        cursorPosition = start + 13 + selectedText.length
        break
      case "code":
        formattedText = `<code>${selectedText}</code>`
        cursorPosition = start + 6 + selectedText.length
        break
      case "align-left":
        formattedText = `<div style="text-align: left;">${selectedText}</div>`
        cursorPosition = start + 30 + selectedText.length
        break
      case "align-center":
        formattedText = `<div style="text-align: center;">${selectedText}</div>`
        cursorPosition = start + 32 + selectedText.length
        break
      case "align-right":
        formattedText = `<div style="text-align: right;">${selectedText}</div>`
        cursorPosition = start + 31 + selectedText.length
        break
      default:
        return
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)

    setContent(newContent)

    // Set focus back to textarea and restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(cursorPosition, cursorPosition)
    }, 0)
  }

  /**
   * Inserts a hyperlink at the current cursor position
   */
  const insertLink = () => {
    if (!linkUrl.trim()) return

    const linkHtml = `<a href="${linkUrl}">${linkText || linkUrl}</a>`

    const textarea = document.getElementById("editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const newContent = content.substring(0, start) + linkHtml + content.substring(end)

    setContent(newContent)
    setShowLinkPopover(false)
    setLinkUrl("")
    setLinkText("")

    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + linkHtml.length, start + linkHtml.length)
    }, 0)
  }

  /**
   * Inserts a variable placeholder at the current cursor position
   * @param variable The variable name to insert
   */
  const insertVariable = (variable: string) => {
    const textarea = document.getElementById("editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const newContent = content.substring(0, start) + `{{${variable}}}` + content.substring(end)

    setContent(newContent)
    setShowVariablePopover(false)

    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4)
    }, 0)
  }

  /**
   * Replaces variables in the email body with sample values for preview
   * @param html The HTML content with variables
   * @returns HTML with variables replaced by sample values
   */
  const getPreviewHtml = (html: string) => {
    return html
      .replace(/{{name}}/g, "John Doe")
      .replace(/{{platform}}/g, "YouTube")
      .replace(/{{category}}/g, "Tech")
      .replace(/{{followers}}/g, "50,000")
  }

  // Toolbar button component to reduce repetition
  const ToolbarButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClick}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        <TabsContent value="edit">
          <div className="border rounded-md p-2 mb-4">
            <div className="flex flex-wrap gap-1 mb-2 border-b pb-2">
              <ToolbarButton icon={<Bold className="h-4 w-4" />} label="Bold" onClick={() => formatText("bold")} />
              <ToolbarButton
                icon={<Italic className="h-4 w-4" />}
                label="Italic"
                onClick={() => formatText("italic")}
              />
              <ToolbarButton
                icon={<Underline className="h-4 w-4" />}
                label="Underline"
                onClick={() => formatText("underline")}
              />

              <div className="h-8 w-px bg-gray-200 mx-1"></div>

              <ToolbarButton icon={<List className="h-4 w-4" />} label="Bullet List" onClick={() => formatText("ul")} />
              <ToolbarButton
                icon={<ListOrdered className="h-4 w-4" />}
                label="Numbered List"
                onClick={() => formatText("ol")}
              />

              <div className="h-8 w-px bg-gray-200 mx-1"></div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Link className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Insert Link</h4>
                            <p className="text-sm text-muted-foreground">Add a hyperlink to your email.</p>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="link-url">URL</Label>
                            <Input
                              id="link-url"
                              placeholder="https://example.com"
                              value={linkUrl}
                              onChange={(e) => setLinkUrl(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="link-text">Text (optional)</Label>
                            <Input
                              id="link-text"
                              placeholder="Click here"
                              value={linkText}
                              onChange={(e) => setLinkText(e.target.value)}
                            />
                          </div>
                          <Button onClick={insertLink}>Insert Link</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent>Insert Link</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <ToolbarButton icon={<Code className="h-4 w-4" />} label="Code" onClick={() => formatText("code")} />

              <div className="h-8 w-px bg-gray-200 mx-1"></div>

              <ToolbarButton
                icon={<AlignLeft className="h-4 w-4" />}
                label="Align Left"
                onClick={() => formatText("align-left")}
              />
              <ToolbarButton
                icon={<AlignCenter className="h-4 w-4" />}
                label="Align Center"
                onClick={() => formatText("align-center")}
              />
              <ToolbarButton
                icon={<AlignRight className="h-4 w-4" />}
                label="Align Right"
                onClick={() => formatText("align-right")}
              />

              <div className="h-8 w-px bg-gray-200 mx-1"></div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover open={showVariablePopover} onOpenChange={setShowVariablePopover}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Type className="h-4 w-4 mr-1" />
                          Insert Variable
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Insert Variable</h4>
                            <p className="text-sm text-muted-foreground">Add dynamic content to your email.</p>
                          </div>
                          <div className="grid gap-2">
                            <Button variant="outline" className="justify-start" onClick={() => insertVariable("name")}>
                              Contact Name
                            </Button>
                            <Button
                              variant="outline"
                              className="justify-start"
                              onClick={() => insertVariable("platform")}
                            >
                              Platform
                            </Button>
                            <Button
                              variant="outline"
                              className="justify-start"
                              onClick={() => insertVariable("category")}
                            >
                              Category
                            </Button>
                            <Button
                              variant="outline"
                              className="justify-start"
                              onClick={() => insertVariable("followers")}
                            >
                              Followers Count
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent>Insert Variable</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <textarea
              id="editor"
              className="w-full h-[400px] p-2 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your email content here..."
            ></textarea>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              Available variables: {"{{"} name {"}}"}, {"{{"} platform {"}}"}, {"{{"} category {"}}"}, {"{{"} followers{" "}
              {"}}"}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="border rounded-md p-6 min-h-[400px]">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: getPreviewHtml(content) }} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
